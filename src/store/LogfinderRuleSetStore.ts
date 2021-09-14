import { atom } from "recoil";
import {
  LogFindersActionRuleSet,
  LogFindersAmountRuleSet
} from "../logfinder/types";

export const LogfinderActionRuleSet = atom<LogFindersActionRuleSet[]>({
  key: "LogfinderActionRuleSetState",
  default: []
});

export const LogfinderAmountRuleSet = atom<LogFindersAmountRuleSet[]>({
  key: "LogfinderAmountRuleSetState",
  default: []
});
