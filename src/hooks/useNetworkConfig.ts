import { useRecoilValue } from "recoil";
import { useCurrentChain } from "../contexts/ChainsContext";
import { Chains } from "../store/ChainsStore";

const useNetworkConfig = () => {
  const lcdChains = useRecoilValue(Chains);
  const { chainID } = useCurrentChain();
  const chains = Object.values(lcdChains);
  const config = chains.find(chain => chain.chainID === chainID);

  return config;
};

export default useNetworkConfig;
