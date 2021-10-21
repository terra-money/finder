import { Dictionary } from "ramda";
import { atom } from "recoil";

export const Chains = atom<Dictionary<Chains>>({
  key: "ChainsState",
  default: {}
});
