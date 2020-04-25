import React from "react";
import { DEFAULT_NETWORK } from "../scripts/utility";

const NetworkContext = React.createContext({
  network: DEFAULT_NETWORK,
  selectNetwork: (network: string) => {}
});

export default NetworkContext;
