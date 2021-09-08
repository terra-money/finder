import { createReturningLogFinder } from "@terra-money/log-finder";
import { Event } from "@terra-money/terra.js";
import { ActionLogFindersRuleSet, AmountLogFindersRuleSet } from "./types";

export const createActionLogMatcher = (
  injectedLogFindersRuleSet: ActionLogFindersRuleSet[] = []
) => {
  const logFindersRuleSet: ActionLogFindersRuleSet[] = [
    ...injectedLogFindersRuleSet
  ];

  const logFinders = logFindersRuleSet.map(({ rule, transform }) =>
    createReturningLogFinder(rule, transform)
  );
  return (events: Event[]) =>
    events?.flatMap(event =>
      logFinders?.map(logFinderFn => logFinderFn(event))
    );
};

export const createAmountLogMatcher = (
  injectedLogFindersRuleSet: AmountLogFindersRuleSet[] = []
) => {
  const logFindersRuleSet: AmountLogFindersRuleSet[] = [
    ...injectedLogFindersRuleSet
  ];

  const logFinders = logFindersRuleSet.map(({ rule, transform }) =>
    createReturningLogFinder(rule, transform)
  );
  return (events: Event[]) =>
    events?.flatMap(event =>
      logFinders?.map(logFinderFn => logFinderFn(event))
    );
};
