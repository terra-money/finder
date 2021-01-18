import React, { useContext } from "react";
import { Dictionary } from "ramda";
import { AccAddress, Coin, ValAddress } from "@terra-money/terra.js";
import { isValid } from "date-fns";
import BigNumber from "bignumber.js";
import contracts from "../components/contracts.json";
import NetworkContext from "../contexts/NetworkContext";
import format from "../scripts/format";
import Address from "./Address";

const NativeDenoms = ["uluna", "ukrw", "uusd", "usdr", "umnt"];

type Data = Dictionary<{ name: string; icon: string }>;

type Props = {
  value: string;
  formatExact?: boolean;
};

const getSymbol = (chainId: string, token: string) => {
  const whitelist = (contracts as Dictionary<Data>)[chainId];
  return whitelist && whitelist[token].name;
};

// 2956884terra1h8arz2k547uvmpxctuwush3jzc8fun4s96qgwt
const CW20TokenRegExp = /^(\d+)(terra[0-9][a-z0-9]{38})$/;

const formatCW20Token = (chainId: string, string: string) => {
  const res = CW20TokenRegExp.exec(string);

  if (!res) {
    return;
  }

  const [, amount, address] = res;
  const symbol = getSymbol(chainId, address);
  return symbol && `${format.amount(amount)} ${symbol}`;
};

const formatCoin = (
  chainId: string,
  string: string,
  formatter = (amount: string) => amount
): string | undefined => {
  try {
    const coin = Coin.fromString(string);
    return [formatter(coin.amount.toString()), format.denom(coin.denom)].join(
      " "
    );
  } catch {
    return formatCW20Token(chainId, string);
  }
};

const renderCoins = (
  chainId: string,
  value: string,
  formatExact?: boolean
): string => {
  return value
    .split(",")
    .map(string => string.trim())
    .map(string => {
      try {
        return formatCoin(
          chainId,
          string,
          formatExact ? undefined : format.amount
        );
      } catch {
        return undefined;
      }
    })
    .filter(Boolean)
    .join("\n");
};

const Formatter = ({ value, formatExact }: Props) => {
  const { network: currentChain } = useContext(NetworkContext);

  const renderFinder =
    ValAddress.validate(value) || AccAddress.validate(value) ? (
      <Address address={value} />
    ) : undefined;

  if (renderFinder) {
    return renderFinder;
  }

  const renderValue = new BigNumber(value).isFinite()
    ? formatExact
      ? value
      : format.amount(value)
    : NativeDenoms.includes(value)
    ? format.denom(value)
    : isValid(new Date(value))
    ? new Date(value).toLocaleString()
    : undefined;

  if (renderValue) {
    return <>{renderValue}</>;
  }

  const coins = renderCoins(currentChain, value, formatExact);

  if (coins) {
    return <>{coins}</>;
  }

  return <>{value}</>;
};

export default Formatter;
