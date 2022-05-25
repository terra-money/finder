import { useQuery } from "react-query";
import { useIsClassic } from "../contexts/ChainsContext";
import useLCDClient from "../hooks/useLCD";
import { RefetchOptions } from "./query";

export const useOracleParams = () => {
  const lcd = useLCDClient();
  const isClassic = useIsClassic();
  return useQuery(
    ["oracleParams", lcd.config, isClassic],
    () => (isClassic ? lcd.oracle.parameters() : undefined),
    {
      ...RefetchOptions.INFINITY
    }
  );
};

export const useDenoms = () => {
  const lcd = useLCDClient();
  const isClassic = useIsClassic();
  return useQuery(
    ["oracleParams", lcd.config, isClassic],
    () => (isClassic ? lcd.oracle.activeDenoms() : undefined),
    {
      ...RefetchOptions.INFINITY
    }
  );
};
