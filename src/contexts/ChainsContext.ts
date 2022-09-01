import { useParams } from "react-router-dom";
import { createContext } from "./createContext";

export const getChains = () =>
  fetch("https://assets.terra.money/chains.json")
    .then(res => res.json())
    .then((data: Record<string, ChainOption>) => Object.values(data));

export const [useChains, ChainsProvider] =
  createContext<ChainOption[]>("Chains");

const useNetworkFromRouteMatch = () => {
  const { network } = useParams();
  return network;
};

export const useCurrentChain = () => {
  const chains:ChainOption[] = useChains();
  const network = useNetworkFromRouteMatch();

  const chain =
    chains.find(chain => chain.name === network || chain.chainID === network) ??
    chains.find(chain => chain.name === "mainnet"); // return mainnet for default chain

  if (!chain) {
    throw new Error("Chain is not defined");
  }

  return chain;
};

export const useFCDURL = () => {
  const { lcd } = useCurrentChain();
  return lcd.replace("lcd", "fcd");
};

export const useIsClassic = () => {
  const { chainID } = useCurrentChain();
  return chainID.startsWith("columbus");
};
