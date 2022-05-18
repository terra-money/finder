import { useQuery } from "react-query";
import useLCDClient from "../hooks/useLCD";
import { RefetchOptions } from "./query";

export const useOracleParams = () => {
  const lcd = useLCDClient();
  return useQuery(["oracleParams"], () => lcd.oracle.parameters(), {
    ...RefetchOptions.INFINITY
  });
};
