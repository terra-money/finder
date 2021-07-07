import { Dictionary } from "ramda";
import { atom } from "recoil";

export const Whitelist = atom<Dictionary<Whitelist>>({
  key: "WhitelistState",
  default: {}
});
