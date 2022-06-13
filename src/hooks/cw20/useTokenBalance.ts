import { useEffect, useState } from "react";
import { Dictionary } from "ramda";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import alias from "./alias";
import { useCurrentChain, useIsClassic } from "../../contexts/ChainsContext";
import { useWhitelist } from "../useTerraAssets";

export interface Token {
  icon?: string;
  symbol: string;
  protocol: string;
  decimals?: number;
}

export interface TokenBalance extends Token {
  balance: string;
}

export type Tokens = Dictionary<Token>;

// classic data type is { Result: string }
// v2 data type is { contractQuery: { balance: string } }
const parseResult = (
  data: Dictionary<{ Result: string; contractQuery: { balance: string } }>,
  isClassic?: boolean
) => {
  const removeEmptyObject = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== null)
  );

  const result = isClassic
    ? Object.entries(removeEmptyObject).reduce(
        (acc, [token, { Result }]) => ({
          ...acc,
          [token]: JSON.parse(Result).balance
        }),
        {}
      )
    : Object.entries(removeEmptyObject).reduce(
        (acc, [token, { contractQuery }]) => ({
          ...acc,
          [token]: contractQuery.balance
        }),
        {}
      );

  return result;
};

const useTokenBalance = (
  address: string
): { loading: boolean; whitelist?: Tokens; list?: TokenBalance[] } => {
  const [result, setResult] = useState<Dictionary<string>>();

  const isClassic = useIsClassic();
  const whitelist = useWhitelist();
  const { mantle, hive } = useCurrentChain();

  useEffect(() => {
    if (address && whitelist) {
      const load = async () => {
        try {
          const client = new ApolloClient({
            uri: hive ?? mantle,
            cache: new InMemoryCache()
          });

          const queries = alias(
            Object.entries(whitelist).map(([key]) => ({
              contract: key,
              msg: { balance: { address } },
              isClassic
            }))
          );

          const { data } = await client.query({
            query: queries,
            errorPolicy: "ignore"
          });

          setResult(parseResult(data, isClassic));
        } catch (error) {
          setResult({});
        }
      };

      load();
    }
  }, [address, whitelist, mantle, hive, isClassic]);

  return {
    loading: !!whitelist && !result,
    whitelist,
    list:
      result &&
      whitelist &&
      Object.entries(result).map(([token, balance]) => ({
        ...whitelist[token],
        balance
      }))
  };
};

export default useTokenBalance;
