import { TxInfo } from "@terra-money/terra.js";
import { createLogMatcher } from "./execute";
import { collector } from "./collector";
import { LogFinderResult, LogFindersRuleSet, TransformResult } from "./types";

export const getMatchLog = (
  data: string,
  ruleArray: LogFindersRuleSet[],
  address?: string
) => {
  const tx: TxInfo = JSON.parse(data);

  try {
    const logMatcher = createLogMatcher(ruleArray);
    if (tx.logs) {
      const matched: LogFinderResult[] = [];

      for (const log of tx.logs) {
        const matchLog = logMatcher(log.events);
        matchLog
          ?.flat()
          .filter(Boolean)
          .forEach(data => {
            if (data.transformed && address) {
              const { match, transformed } = data;
              const type = transformed.msgType;
              if (["terra/send", "token/transfer"].includes(type)) {
                const result = getTransformed(address, match, transformed);
                matched.push({
                  ...data,
                  transformed: result,
                  timestamp: tx.timestamp
                });
                return;
              }
            }
            matched.push({ ...data, timestamp: tx.timestamp });
          });
      }

      const logMatched = collector(matched);
      return logMatched.length > 0 ? logMatched : undefined;
    }
  } catch {
    return undefined;
  }
};

type Match = {
  key: string;
  value: string;
};

const getTransformed = (
  address: string,
  match: Match[],
  transformed: TransformResult
) => {
  const type = transformed.msgType;
  const sender = type === "terra/send" ? match[1].value : match[2].value;

  const amount =
    type === "terra/send"
      ? match[2].value
      : `${match[4].value}${match[0].value}`; //if msgType === token/transfer

  sender === address
    ? (transformed.amountOut = amount)
    : (transformed.amountIn = amount);

  return transformed;
};
