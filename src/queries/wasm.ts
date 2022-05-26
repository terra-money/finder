import { useQuery } from "react-query";
import useLCDClient from "../hooks/useLCD";

const useContractInfo = (address: string) => {
  const lcd = useLCDClient();
  return useQuery(
    ["contractInfo", address, lcd.config],
    async () => await lcd.wasm.contractInfo(address)
  );
};

export default useContractInfo;
