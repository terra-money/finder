import { useRecoilValue } from "recoil";
import { useNetwork } from "../HOCs/WithFetch";
import { Chains } from "../store/ChainsStore";

const useNetworkConfig = () => {
  const lcdChains = useRecoilValue(Chains);
  const chainID = useNetwork();
  const chains = Object.values(lcdChains);
  const config = chains.find(chain => chain.chainID === chainID);

  return config;
};

export default useNetworkConfig;
