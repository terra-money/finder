import { useQuery } from "react-query";
import axios from "axios";
import { Dictionary } from "lodash";
import { useCurrentChain } from "../contexts/ChainsContext";
import { ASSET_URL } from "../scripts/utility";

const config = { baseURL: "https://assets.terra.money" };

const useTerraAssets = <T = any>(path: string) =>
  useQuery([path, config, "terraAssets"], async () => {
    const { data: result } = await axios.get<T>(path, config);
    return result;
  });

export default useTerraAssets;

export type TokenList = Dictionary<Whitelist>;
export type IBCTokenList = Dictionary<IBCWhitelist>;
export type ContractList = Dictionary<Contracts>;
export type NFTContractList = Dictionary<NFTContracts>;

export const useIBCWhitelist = (): IBCTokenList => {
  const chainID = useCurrentChain();
  const { data } = useQuery(["IBCWhitelist", chainID], () =>
    axios.get(`${ASSET_URL}/ibc/tokens.json`)
  );

  return data?.data?.[chainID.name];
};

export const useWhitelist = () => {
  const { name } = useCurrentChain();
  const { data } = useTerraAssets<Dictionary<TokenList>>("cw20/tokens.json");
  return data?.[name];
};

export const useContracts = () => {
  const { name } = useCurrentChain();
  const { data } = useTerraAssets<Dictionary<ContractList>>(
    "cw20/contracts.json"
  );
  return data?.[name];
};

export const useNFTContracts = () => {
  const { name } = useCurrentChain();
  const { data } = useTerraAssets<Dictionary<NFTContractList>>(
    "cw721/contracts.json"
  );
  return data?.[name];
};
