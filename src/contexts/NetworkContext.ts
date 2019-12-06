import React from "react";
import { DEFAULT_NETWORK } from "../scripts/utility";

const NetworkContext = React.createContext({
  network: DEFAULT_NETWORK,
  setNetwork: (network: string) => {}
});

export default NetworkContext;
