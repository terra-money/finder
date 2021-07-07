import { atom } from "recoil";

export const Denoms = atom<string[]>({
  key: "DenomState",
  default: []
});
