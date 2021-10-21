import { useMemo } from "react";
import { LCDClient } from "@terra-money/terra.js";
import { useNetwork } from "../HOCs/WithFetch";
import { transformChainId } from "../scripts/utility";

const MAINNET_URL = "https://lcd.terra.dev";
const TESTNET_URL = "https://bombay-lcd.terra.dev";

const useLCD = () => {
  const chainID = useNetwork();
  const networkName = transformChainId(chainID);
  const url = networkName === "mainnet" ? MAINNET_URL : TESTNET_URL;

  const lcd = useMemo(
    () => new LCDClient({ chainID, URL: url }),
    [chainID, url]
  );
  return lcd;
};

export default useLCD;
