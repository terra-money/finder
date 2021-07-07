import { Dictionary } from "ramda";
import { atom } from "recoil";

export const Contracts = atom<Dictionary<Contracts>>({
  key: "ContractState",
  default: {}
});
