import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { DenomTrace } from "@terra-money/terra.js/dist/core/ibc-transfer/DenomTrace";
import { isIbcDenom } from "../scripts/utility";
import useLCD from "./useLCD";

const useDenomTrace = (denom = "") => {
  const lcd = useLCD();
  const hash = denom.replace("ibc/", "");
  const [ibcData, setIBCData] = useState<DenomTrace>();
  const { data } = useQuery(
    ["denomTrace", hash],
    async () => {
      const { denom_trace } = (await lcd.ibcTransfer.denomTrace(
        hash
      )) /* TODO: Remove force typing on terra.js fixed */ as unknown as {
        denom_trace: DenomTrace;
      };
      return denom_trace;
    },
    { enabled: isIbcDenom(denom) }
  );

  useEffect(() => {
    data && setIBCData(data);
  }, [data]);

  return ibcData;
};

export default useDenomTrace;
