import { atom } from "recoil";
import {
  LogFindersActionRuleSet,
  LogFindersAmountRuleSet
} from "@terra-money/log-finder-ruleset";

export const LogfinderActionRuleSet = atom<LogFindersActionRuleSet[]>({
  key: "LogfinderActionRuleSetState",
  default: []
});

export const LogfinderAmountRuleSet = atom<LogFindersAmountRuleSet[]>({
  key: "LogfinderAmountRuleSetState",
  default: []
});
