import { useQuery } from "react-query";
import useLCDClient from "../hooks/useLCD";
import { RefetchOptions } from "./query";

export const useValidatorSet = (height?: number) => {
  const lcd = useLCDClient();
  return useQuery(
    [lcd.config, height, "validatorSet"],
    async () => {
      //TODO: Iterator
      const [v1] = await lcd.tendermint.validatorSet(height);
      const [v2] = await lcd.tendermint.validatorSet(height, {
        "pagination.offset": String(v1.length)
      });

      return [...v1, ...v2];
    },
    { ...RefetchOptions.INFINITY }
  );
};
