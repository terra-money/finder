import { atom } from "recoil";
import { AmountLogFindersRuleSet } from "../logfinder/types";

export const AmountLogfinderRuleSet = atom<AmountLogFindersRuleSet[]>({
  key: "AmountLogfinderRuleSetState",
  default: []
});
