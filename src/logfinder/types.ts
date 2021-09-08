import {
  ReturningLogFinderTransformer,
  LogFinderRule,
  LogFragment
} from "@terra-money/log-finder";

export interface ActionTransformResult {
  msgType: string;
  canonicalMsg: string[];
  payload: LogFragment;
}

export interface AmountTransformResult {
  type: string;
  amount: string;
  sender: string;
  recipient: string;
  withdraw_date?: string;
}

export interface AmountLogFindersRuleSet {
  rule: LogFinderRule;
  transform: ReturningLogFinderTransformer<AmountTransformResult>;
}
export interface ActionLogFindersRuleSet {
  rule: LogFinderRule;
  transform: ReturningLogFinderTransformer<ActionTransformResult>;
}

export interface ActionLogFinderResult {
  timestamp: string;
  fragment: LogFragment;
  match: {
    key: string;
    value: string;
  }[];
  height?: number;
  transformed?: ActionTransformResult;
  txhash?: string;
}

export interface AmountLogFinderResult {
  timestamp: string;
  fragment: LogFragment;
  match: {
    key: string;
    value: string;
  }[];
  height?: number;
  transformed?: AmountTransformResult;
  txhash?: string;
}
