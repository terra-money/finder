import anchor from "./anchor";
import mirror from "./mirror";
import pylon from "./pylon";
import terra from "./terra-core";
import cw20 from "./cw20";

const create = (network: string) =>
  [cw20(), anchor(network), mirror(network), pylon(network), terra()].flat();

export default create;
