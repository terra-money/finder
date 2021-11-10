import { useEffect, useState } from "react";
import { Dictionary } from "ramda";
import { useRecoilValue } from "recoil";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import alias from "./alias";
import { Whitelist } from "../../store/WhitelistStore";
import { useCurrentChain } from "../../contexts/ChainsContext";

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

const parseResult = (data: Dictionary<{ Result: string }>) => {
  const removeEmptyObject = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== null)
  );

  return Object.entries(removeEmptyObject).reduce(
    (acc, [token, { Result }]) => ({
      ...acc,
      [token]: JSON.parse(Result).balance
    }),
    {}
  );
};

const useTokenBalance = (
  address: string
): { loading: boolean; whitelist?: Tokens; list?: TokenBalance[] } => {
  const [result, setResult] = useState<Dictionary<string>>();

  const whitelist: Tokens = useRecoilValue(Whitelist);
  const { mantle } = useCurrentChain();

  useEffect(() => {
    if (address && whitelist) {
      const load = async () => {
        try {
          const client = new ApolloClient({
            uri: mantle,
            cache: new InMemoryCache()
          });

          const queries = alias(
            Object.entries(whitelist).map(([key]) => ({
              contract: key,
              msg: { balance: { address } }
            }))
          );

          const { data } = await client.query({
            query: queries,
            errorPolicy: "ignore"
          });

          setResult(parseResult(data));
        } catch (error) {
          setResult({});
        }
      };

      load();
    }
  }, [address, whitelist, mantle]);

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
