import { useQuery } from "react-query";
import { isIbcDenom } from "../scripts/utility";
import useLCDClient from "./useLCD";

const useDenomTrace = (denom = "") => {
  const lcd = useLCDClient();
  const hash = denom.replace("ibc/", "");
  const { data } = useQuery(
    ["denomTrace", hash],
    async () => {
      const denom_trace = await lcd.ibcTransfer.denomTrace(hash);
      return denom_trace;
    },
    { enabled: isIbcDenom(denom) }
  );

  return data;
};

export default useDenomTrace;
