import {
  ReturningLogFinderTransformer,
  LogFinderRule,
  LogFragment
} from "@terra-money/log-finder";

export interface TransformResult {
  msgType: string;
  canonicalMsg: string[];
  payload: LogFragment;
  amountIn?: string;
  amountOut?: string;
}

export interface LogFindersRuleSet {
  rule: LogFinderRule;
  transform: ReturningLogFinderTransformer<TransformResult>;
}

export interface LogFinderResult {
  timestamp: string;
  fragment: LogFragment;
  match: {
    key: string;
    value: string;
  }[];
  height?: number;
  transformed?: TransformResult;
}
