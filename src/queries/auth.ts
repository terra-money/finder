import { useQuery } from "react-query";
import useLCDClient from "../hooks/useLCD";
import { RefetchOptions } from "./query";

export const useAccountInfo = (address: string) => {
  const lcd = useLCDClient();
  return useQuery(
    ["accountInfo", address, lcd.config],
    async () => await lcd.auth.accountInfo(address),
    { ...RefetchOptions.DEFAULT }
  );
};
