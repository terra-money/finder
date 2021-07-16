import { atom } from "recoil";
import { LogFindersRuleSet } from "../logfinder/types";

export const LogfinderRuleSet = atom<LogFindersRuleSet[]>({
  key: "LogfinderRuleSetState",
  default: []
});
