import { useQuery } from "react-query";
import { useLCDClient } from "./NetworkProvider";

interface TokenInfo {
  symbol: string;
  decimals: number;
}

const useTokenContractQuery = (address: string) => {
  const lcd = useLCDClient();
  return useQuery(["token", address], () =>
    lcd.wasm.contractQuery<TokenInfo>(address, {
      token_info: {}
    })
  );
};

export default useTokenContractQuery;
