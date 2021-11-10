import { WalletControllerChainOptions } from "@terra-money/wallet-provider";
import { useLocation } from "react-router";
import { createContext } from "./createContext";

export const [useChainsOptions, ChainsOptionsProvider] =
  createContext<WalletControllerChainOptions>("Chains");

export const useChains = () => {
  const { walletConnectChainIds } = useChainsOptions();
  return Object.values(walletConnectChainIds) as ChainOption[];
};

export const useDefaultChain = () => {
  const { defaultNetwork } = useChainsOptions();
  return defaultNetwork;
};

export const useCurrentChainPath = () => {
  // mainnet | testnet | localterra
  const { pathname } = useLocation();
  return pathname.split("/")[1]; /* TODO: 더 간단하게 가져올 방법 확인 */
};

export const useCurrentChain = () => {
  const currentChainPath = useCurrentChainPath();
  const chains = useChains();
  const chain = chains.find(chain => chain.name === currentChainPath);

  /* TODO: columbus-5 -> mainnet 컨버트하는 동작 필요 */

  if (!chain) throw new Error("Chain is not defined");

  return chain;
};

export const useFCDURL = () => {
  const { lcd } = useCurrentChain();
  /* TODO: 로컬테라는 lcd 주소 안에 lcd라는 단어가 없음 */
  return lcd.replace("lcd", "fcd");
};
