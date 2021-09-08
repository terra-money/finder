import { atom } from "recoil";
import { ActionLogFindersRuleSet } from "../logfinder/types";

export const ActionLogfinderRuleSet = atom<ActionLogFindersRuleSet[]>({
  key: "ActionLogfinderRuleSetState",
  default: []
});
