import { useMemo } from "react";
import { LCDClient } from "@terra-money/terra.js";
import { useNetwork } from "../HOCs/WithFetch";
import { DEFAULT_LCD } from "../scripts/utility";
import useNetworkConfig from "./useNetworkConfig";

const useLCD = () => {
  const config = useNetworkConfig();
  const chainID = useNetwork();
  const url = config?.lcd || DEFAULT_LCD;

  const lcd = useMemo(
    () => new LCDClient({ URL: url, chainID }),
    [url, chainID]
  );
  return lcd;
};

export default useLCD;
