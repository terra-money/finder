import { TxInfo, Event } from "@terra-money/terra.js";
import { collector } from "./collector";
import {
  AmountTransformResult,
  ActionLogFinderResult,
  AmountLogFinderResult,
  ActionTransformResult
} from "./types";
import { ReturningLogFinderResult } from "@terra-money/log-finder";
import { useMemo } from "react";
import { createAmountLogMatcher, createActionLogMatcher } from "./execute";
import { useRecoilValue } from "recoil";
import { AmountLogfinderRuleSet } from "../store/AmountLoginfderRuleSetStore";
import { ActionLogfinderRuleSet } from "../store/ActionLogfinderRuleSetStore";

export const getMatchAction = (
  data: string,
  logMatcher: (
    events: Event[]
  ) => ReturningLogFinderResult<ActionTransformResult>[][]
) => {
  const tx: TxInfo = JSON.parse(data);

  try {
    if (tx.logs) {
      const matched: ActionLogFinderResult[][] = tx.logs.map(log => {
        const matchLog = logMatcher(log.events);
        const matchedPerLog = matchLog
          ?.flat()
          .filter(Boolean)
          .map(data => ({ ...data, timestamp: tx.timestamp }));

        return matchedPerLog;
      });

      const logMatched = matched.map(match => collector(match));
      return logMatched.length > 0 ? logMatched : undefined;
    }
  } catch {
    return undefined;
  }
};

export const getMatchAmount = (
  data: string,
  logMatcher: (
    events: Event[]
  ) => ReturningLogFinderResult<AmountTransformResult>[][],
  address: string
) => {
  const tx: TxInfo.Data = JSON.parse(data);
  const msgTypes = tx.tx.value.msg;

  try {
    if (tx.logs) {
      const { timestamp, txhash } = tx;
      const matched: AmountLogFinderResult[][] = tx.logs.map((log, index) => {
        const matchLog = logMatcher(log.events);
        const matchedPerLog = matchLog
          ?.flat()
          .filter(Boolean)
          .map(data => {
            if (data.transformed) {
              const { transformed } = data;
              const { type, withdraw_date } = transformed;
              const msgType = msgTypes[index].type.split("/")[1];
              if (type === "delegate" && msgType === "MsgDelegate") {
                return {
                  ...data,
                  timestamp: timestamp,
                  txhash: txhash,
                  transformed: { ...transformed, sender: address }
                };
              } else if (
                type === "unDelegate" &&
                msgType === "MsgUndelegate" &&
                withdraw_date
              ) {
                const now = new Date();
                const withdrawDate = new Date(withdraw_date);
                return {
                  ...data,
                  timestamp: timestamp,
                  txhash: txhash,
                  transformed: {
                    ...transformed,
                    recipient: now > withdrawDate ? address : ""
                  }
                };
              }
            }

            return { ...data, timestamp: timestamp, txhash: txhash };
          });

        return matchedPerLog;
      });

      const logMatched = matched.flat();
      return logMatched.length > 0 ? logMatched : undefined;
    }
  } catch {
    return undefined;
  }
};

/* hooks */
export const useAmountLogMatcher = () => {
  const ruleArray = useRecoilValue(AmountLogfinderRuleSet);
  const logMatcher = useMemo(
    () => createAmountLogMatcher(ruleArray),
    [ruleArray]
  );
  return logMatcher;
};

export const useActionLogMatcher = () => {
  const ruleArray = useRecoilValue(ActionLogfinderRuleSet);
  const logMatcher = useMemo(
    () => createActionLogMatcher(ruleArray),
    [ruleArray]
  );
  return logMatcher;
};
