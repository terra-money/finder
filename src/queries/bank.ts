import { useQuery } from "react-query";
import { useIsClassic } from "../contexts/ChainsContext";
import useLCDClient from "../hooks/useLCD";
import { sortByDenom } from "../scripts/utility";
import { RefetchOptions } from "./query";

export const useInitialBankBalance = (address: string) => {
  const lcd = useLCDClient();
  const isClassic = useIsClassic();
  return useQuery(
    ["bankBalance", address, isClassic, lcd.config],
    async () => {
      if (isClassic) {
        const [coins] = await lcd.bank.balance(address);
        const result = sortByDenom(coins.toArray());
        return result;
      }

      const [coins] = await lcd.bank.spendableBalances(address);
      const result = sortByDenom(coins.toArray());
      return result;
    },
    { ...RefetchOptions.DEFAULT }
  );
};
