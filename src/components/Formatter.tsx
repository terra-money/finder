import React, { useContext } from "react";
import { Dictionary } from "ramda";
import { AccAddress, Coin, ValAddress } from "@terra-money/terra.js";
import BigNumber from "bignumber.js";
import { Tokens } from "../hooks/cw20/useTokenBalance";
import tokens from "../hooks/cw20/tokens.json";
import NetworkContext from "../contexts/NetworkContext";
import format from "../scripts/format";
import Finder from "./Finder";

type Props = {
  attr: Attributes;
  formatExact?: boolean;
};

const NativeDenoms = ["uluna", "ukrw", "uusd", "usdr", "umnt"];
const Formatter = ({ attr, formatExact }: Props) => {
  const { network: currentChain } = useContext(NetworkContext);
  const { value = "" } = attr;

  return ValAddress.validate(value) ? (
    <Finder q="validator" v={value} children={value} />
  ) : AccAddress.validate(value) ? (
    <Finder q="address" v={value} children={value} />
  ) : new BigNumber(value).isFinite() ? (
    <>{formatExact ? value : format.amount(value)}</>
  ) : NativeDenoms.includes(value) ? (
    <>{format.denom(value)}</>
  ) : (
    <>
      {value
        .split(",")
        .map(string => string.trim())
        .map(string =>
          formatCoin(
            string,
            currentChain,
            formatExact ? undefined : format.amount
          )
        )}
    </>
  );
};

export default Formatter;

/* utils */
const formatCoin = (
  string: string,
  network: string,
  formatter = (amount: string) => amount
) => {
  try {
    const coin = Coin.fromString(string);
    return [
      formatter(coin.amount.toString()),
      `${format.denom(coin.denom)}\n`
    ].join(" ");
  } catch {
    return formatCW20Token(string, network);
  }
};

const formatCW20Token = (string: string, network: string) => {
  const [, amount, token] = string.split(/(\d+)(\w+)/);
  const valid = amount && token;
  return valid
    ? [format.amount(amount), getSymbol(token, network)].join(" ")
    : string;
};

const getSymbol = (token: string, network: string) => {
  const whitelist = network && (tokens as Dictionary<Tokens>)[network];
  return `${whitelist && whitelist[token].symbol}\n`;
};
