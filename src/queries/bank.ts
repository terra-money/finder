import { useQuery } from "react-query";
import useLCDClient from "../hooks/useLCD";
import { sortByDenom } from "../scripts/utility";
import { RefetchOptions } from "./query";

export const useInitialBankBalance = (address: string) => {
  const lcd = useLCDClient();
  return useQuery(
    ["bankBalance", address],
    async () => {
      const [coins] = await lcd.bank.balance(address);
      const result = sortByDenom(coins.toArray());
      return result;
    },
    { ...RefetchOptions.DEFAULT }
  );
};
