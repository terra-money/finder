import { useEffect, useState, useContext } from "react";
import { Dictionary } from "ramda";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import NetworkContext from "../../contexts/NetworkContext";
import contracts from "../../components/contracts.json";
import alias from "./alias";
import { mantleUri } from "../../scripts/utility";

export interface Token {
  icon?: string;
  name: string;
  category: string;
}

export interface TokenBalance extends Token {
  balance: string;
}

export type Tokens = Dictionary<Token>;

const parseResult = (data: Dictionary<{ Result: string }>) =>
  Object.entries(data).reduce(
    (acc, [token, { Result }]) => ({
      ...acc,
      [token]: JSON.parse(Result).balance
    }),
    {}
  );

const useTokenBalance = (
  address: string
): { loading: boolean; whitelist?: Tokens; list?: TokenBalance[] } => {
  const [result, setResult] = useState<Dictionary<string>>();
  const { network: currentChain } = useContext(NetworkContext);
  const whitelist = (contracts as Dictionary<Tokens | undefined>)[currentChain];
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
            Object.entries(whitelist).map(([key, { category }]) => ({
              contract: key,
              msg: { balance: { address } },
              category: category
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

export default useTokenBalance;
