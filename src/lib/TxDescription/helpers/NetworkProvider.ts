import { useMemo } from "react";
import { LCDClient } from "@terra-money/terra.js";
import { ComponentProps } from "./types";
import createContext from "./createContext";

export const [useProps, PropsProvider] =
  createContext<ComponentProps>("NetworkProvider");

export const useNetwork = () => {
  const { network } = useProps();
  return network;
};

export const useLCDClient = () => {
  const network = useNetwork();
  const lcdClient = useMemo(() => new LCDClient(network), [network]);
  return lcdClient;
};
