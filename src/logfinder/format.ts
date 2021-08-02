import { TxInfo, Event } from "@terra-money/terra.js";
import { collector } from "./collector";
import { LogFinderResult, TransformResult } from "./types";
import { ReturningLogFinderResult } from "@terra-money/log-finder";

export const getMatchLog = (
  data: string,
  logMatcher: (
    events: Event[]
  ) => ReturningLogFinderResult<TransformResult>[][],
  address?: string
) => {
  const tx: TxInfo = JSON.parse(data);

  try {
    if (tx.logs) {
      const matched: LogFinderResult[][] = tx.logs.map(log => {
        const matchLog = logMatcher(log.events);
        const matchedPerLog = matchLog
          ?.flat()
          .filter(Boolean)
          .map(data => {
            if (data.transformed && address) {
              const { match, transformed } = data;
              const type = transformed.msgType;
              if (["terra/send", "token/transfer"].includes(type)) {
                const result = getTransformed(address, match, transformed);
                return {
                  ...data,
                  transformed: result,
                  timestamp: tx.timestamp
                };
                // return;
              }
            }
            return { ...data, timestamp: tx.timestamp };
          });

        return matchedPerLog;
      });

      const logMatched = matched.map(match => collector(match)).flat();
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

  if (type === "terra/send") {
    if (![match[0].value, match[1].value].includes(address)) {
      return undefined;
    }
  }

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
