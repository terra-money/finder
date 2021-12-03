import { Dictionary } from "ramda";
import { atom } from "recoil";

export const NFTContracts = atom<Dictionary<NFTContracts>>({
  key: "NFTContractState",
  default: {}
});
