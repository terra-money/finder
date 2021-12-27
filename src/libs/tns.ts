import { LCDClient } from "@terra-money/terra.js";
import { Buffer } from "buffer";
import keccak256 from "keccak256";
import { useCurrentChain } from "../contexts/ChainsContext";
import useLCDClient from "../hooks/useLCD";

const registryMap: Record<string, string> = {
  mainnet: "terra19gqw63xnt9237d2s8cdrzstn98g98y7hkl80gs",
  testnet: "terra1fmmced3dms3ha2st4y2qj8w5v2zyel7xpg8wpq"
};

export const useTns = () => {
  const { name } = useCurrentChain();
  const lcd = useLCDClient();
  const registryAddress = registryMap[name];

  return {
    getTerraAddress: (name: string) =>
      getTerraAddress(lcd, registryAddress, name)
  };
};

/**
 * Check whether a given name is a valid TNS identifier.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns `true` if it is a valid TNS identifier, `false` otherwise
 */
export const isTnsName = (name: string) => {
  const baseNames = ["ust"];

  return baseNames.some(baseName => {
    const dotBaseName = "." + baseName;

    return (
      !name.startsWith(".") &&
      !name.includes("..") &&
      name.endsWith(dotBaseName)
    );
  });
};

/**
 * Resolve terra address from a domain name.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns The terra address of the specified name, `null` if not resolvable
 */
const getTerraAddress = async (
  lcd: LCDClient,
  registryAddress: string,
  name: string
) => {
  const resolverAddress = await getResolverAddress(lcd, registryAddress, name);

  if (!resolverAddress) return null;

  const result = await lcd.wasm
    .contractQuery<{ address: string }>(resolverAddress, {
      get_terra_address: { node: node(name) }
    })
    .catch(() => null); // Terra address is not set

  return result?.address ?? null;
};

/**
 * Get the resolver address of the given domain name.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns The Resolver contract address of the specified name, `null` if the domain does not exist.
 */
const getResolverAddress = async (
  lcd: LCDClient,
  registryAddress: string,
  name: string
) => {
  const result = await lcd.wasm
    .contractQuery<{ resolver: string }>(registryAddress, {
      get_record: { name }
    })
    .catch(() => null); // Domain does not exist

  return result?.resolver ?? null;
};

/**
 * Generate a unique hash for any valid domain name.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns The result of namehash function in a {@link Buffer} form
 */
const namehash = (name: string): Buffer => {
  if (name) {
    const [label, remainder] = name.split(".");
    return keccak256(Buffer.concat([namehash(remainder), keccak256(label)]));
  }

  return Buffer.from("".padStart(64, "0"), "hex");
};

/**
 * Generate the output of the namehash function in a form of number array
 * which is supported by the contract query.
 *
 * @param name - A TNS identifier such as "alice.ust"
 * @returns The result of namehash function in a number array format
 */
const node = (name: string) => {
  return Array.from(Uint8Array.from(namehash(name)));
};
