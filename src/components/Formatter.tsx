import React, { useContext } from "react";
import { Dictionary } from "ramda";
import { AccAddress, Coin, ValAddress } from "@terra-money/terra.js";
import { isValid } from "date-fns";
import BigNumber from "bignumber.js";
import { Tokens } from "../hooks/cw20/useTokenBalance";
import tokens from "../hooks/cw20/tokens.json";
import NetworkContext from "../contexts/NetworkContext";
import format from "../scripts/format";
import Finder from "./Finder";

const NativeDenoms = ["uluna", "ukrw", "uusd", "usdr", "umnt"];
const useFormatter = () => {
  const { network: currentChain } = useContext(NetworkContext);

  return (value: string, formatExact?: boolean) => {
    const formatCoin = (
      string: string,
      formatter = (amount: string) => amount
    ) => {
      try {
        const coin = Coin.fromString(string);
        return [
          formatter(coin.amount.toString()),
          format.denom(coin.denom)
        ].join(" ");
      } catch {
        return formatCW20Token(string);
      }
    };

    const formatCW20Token = (string: string) => {
      const [, amount, token] = string.split(/(\d+)(\w+)/);
      return [format.amount(amount), getSymbol(token)].join(" ");
    };

    const getSymbol = (token: string) => {
      const whitelist =
        currentChain && (tokens as Dictionary<Tokens>)[currentChain];
      return whitelist && whitelist[token].symbol;
    };

    const renderCoins = value
      .split(",")
      .map(string => string.trim())
      .map(string => {
        try {
          return formatCoin(string, formatExact ? undefined : format.amount);
        } catch {
          return undefined;
        }
      })
      .join("\n");

    const renderFinder = ValAddress.validate(value) ? (
      <Finder q="validator" v={value} children={value} />
    ) : AccAddress.validate(value) ? (
      <Finder q="address" v={value} children={value} />
    ) : undefined;

    const renderValue = new BigNumber(value).isFinite()
      ? format.amount(value)
      : NativeDenoms.includes(value)
      ? format.denom(value)
      : isValid(new Date(value))
      ? new Date(value).toLocaleString()
      : undefined;

    return renderFinder || renderValue || renderCoins || value;
  };
};

export default useFormatter;
