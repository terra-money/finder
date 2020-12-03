import { useEffect, useState, useContext } from "react";
import { Dictionary } from "ramda";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import NetworkContext from "../../contexts/NetworkContext";
import tokens from "./tokens.json";
import alias from "./alias";
import { mantleUri } from "../../scripts/utility";

export interface Token {
  symbol: string;
  icon?: string;
  token: string;
}

export interface TokenBalance extends Token {
  balance: string;
}

export type Tokens = Dictionary<Token>;

export default (
  address: string
): { loading: boolean; whitelist?: Tokens; list?: TokenBalance[] } => {
  const [result, setResult] = useState<Dictionary<string>>();
  const { network: currentChain } = useContext(NetworkContext);
  const whitelist = (tokens as Dictionary<Tokens | undefined>)[currentChain];
  const mantle = mantleUri(currentChain);

  useEffect(() => {
    if (address && whitelist) {
      const load = async () => {
        try {
          const client = new ApolloClient({
            uri: mantle,
            cache: new InMemoryCache()
          });

          const queries = alias(
            Object.values(whitelist).map(({ token }) => ({
              token,
              contract: token,
              msg: { balance: { address } }
            }))
          );

          const { data } = await client.query({ query: queries });
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

const parseResult = (data: Dictionary<{ Result: string }>) =>
  Object.entries(data).reduce(
    (acc, [token, { Result }]) => ({
      ...acc,
      [token]: JSON.parse(Result).balance
    }),
    {}
  );
