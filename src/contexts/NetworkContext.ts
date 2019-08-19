import { createContext } from "react";

const initialState = {
  network: "",
  setNetwork: () => {}
};

interface NetworkContextInterface {
  network: string;
  setNetwork: Function;
}

const NetworkContext = createContext<NetworkContextInterface>(initialState);
export default NetworkContext;
