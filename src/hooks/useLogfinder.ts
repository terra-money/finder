import {
  createActionRuleSet,
  createAmountRuleSet
} from "@terra-money/log-finder-ruleset";
import { useCurrentChain } from "../contexts/ChainsContext";

export const useLogfinderActionRuleSet = () => {
  const { name } = useCurrentChain();
  const actionRules = createActionRuleSet(name);
  return actionRules;
};

export const useLogfinderAmountRuleSet = () => {
  const amountRules = createAmountRuleSet();
  return amountRules;
};
