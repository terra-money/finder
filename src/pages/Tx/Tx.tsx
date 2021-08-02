import React, { useMemo } from "react";
import { RouteComponentProps } from "react-router-dom";
import { get, last, isArray, isObject } from "lodash";
import { useRecoilValue } from "recoil";
import Finder from "../../components/Finder";
import MsgBox from "../../components/MsgBox";
import Copy from "../../components/Copy";
import Loading from "../../components/Loading";
import WithFetch from "../../HOCs/WithFetch";
import format from "../../scripts/format";
import { getMatchLog } from "../../logfinder/format";
import { createLogMatcher } from "../../logfinder/execute";
import { fromISOTime, sliceMsgType } from "../../scripts/utility";
import { LogfinderRuleSet } from "../../store/LogfinderRuleSetStore";
import Action from "./Action";
import s from "./Tx.module.scss";

function isSendTx(response: TxResponse) {
  const type = get(response, "tx.value.msg[0].type");
  return [`MsgMultiSend`, `MsgSend`].includes(sliceMsgType(type));
}

function getAmountAndDenom(tax: string) {
  const result = /-?\d*\.?\d+/g.exec(tax);

  if (!result) {
    return {
      amount: 0,
      denom: ""
    };
  }

  return {
    amount: +result[0],
    denom: tax.slice(result[0].length)
  };
}

function getTotalTax(txResponse: TxResponse) {
  const logs = get(txResponse, "logs");

  if (!isArray(logs)) {
    return `0 Luna`;
  }

  const result: { [key: string]: number } = {};

  logs.forEach(log => {
    if (!isObject(log)) {
      return;
    }

    try {
      const tax = get(log, "log.tax");

      if (typeof tax !== "string" || tax.length === 0) {
        return;
      }

      tax.split(",").forEach(tax => {
        const { amount, denom } = getAmountAndDenom(tax);

        if (denom && amount) {
          result[denom] = amount + (result[denom] || 0);
        }
      });
    } catch (err) {
      // ignore JSON.parse error
    }
  });

  const keys = Object.keys(result);

  if (!keys.length) {
    return `0 Luna`;
  }

  return keys
    .map(
      denom =>
        `${format.coin({
          amount: result[denom].toString(),
          denom
        })}`
    )
    .join(", ");
}

function getTotalFee(txResponse: TxResponse) {
  const fee = get(txResponse, "tx.value.fee");
  const amount = fee.amount;
  const result: { [key: string]: string } = {};

  if (!amount) {
    return `0 Luna`;
  }

  amount.forEach((a: CoinData) => {
    if (!isObject(a)) {
      return;
    }

    try {
      result[a.denom] = a.amount;
    } catch (err) {
      // ignore JSON.parse error
    }
  });

  const keys = Object.keys(result);

  if (!keys.length) {
    return `0 Luna`;
  }

  return keys
    .map(
      denom =>
        `${format.coin({
          amount: result[denom],
          denom
        })}`
    )
    .join(", ");
}

const Txs = (props: RouteComponentProps<{ hash: string }>) => {
  const { match } = props;
  const { hash } = match.params;
  const ruleArray = useRecoilValue(LogfinderRuleSet);

  const logMatcher = useMemo(() => {
    return createLogMatcher(ruleArray);
  }, [ruleArray]);

  return (
    <WithFetch url={`/v1/tx/${hash}`} loading={<Loading />}>
      {(response: TxResponse) => {
        const matchedLog = getMatchLog(JSON.stringify(response), logMatcher);
        return (
          <>
            <h2 className="title">Transaction Details</h2>

            <div className={s.list}>
              <div className={s.row}>
                <div className={s.head}>Transaction hash</div>
                <div className={s.body}>
                  <div>
                    {response.txhash}
                    <Copy
                      text={response.txhash}
                      style={{ display: "inline-block", position: "absolute" }}
                    />
                  </div>
                </div>
              </div>
              <div className={s.row}>
                <div className={s.head}>Status</div>
                <div className={s.body}>
                  {!response.code ? (
                    <span className={s.success}>Success</span>
                  ) : (
                    <>
                      <p className={s.fail}>Failed</p>
                      <p className={s.failedMsg}>
                        {get(last(response.logs), "log.message") ||
                          get(response, "raw_log")}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className={s.row}>
                <div className={s.head}>Network</div>
                <div className={s.body}>{response.chainId}</div>
              </div>
              <div className={s.row}>
                <div className={s.head}>Block</div>
                <div className={s.body}>
                  <Finder q="blocks" v={response.height}>
                    {response.height}
                  </Finder>
                </div>
              </div>
              <div className={s.row}>
                <div className={s.head}>Timestamp</div>
                <div className={s.body}>
                  {fromISOTime(response.timestamp.toString())}
                </div>
              </div>
              <div className={s.row}>
                <div className={s.head}>Transaction fee</div>
                <div className={s.body}>{getTotalFee(response)}</div>
              </div>
              {isSendTx(response) && (
                <div className={s.row}>
                  <div className={s.head}>Tax</div>
                  <div className={s.body}>{getTotalTax(response)}</div>
                </div>
              )}
              <div className={s.row}>
                <div className={s.head}>Gas (Used/Requested)</div>
                <div className={s.body}>
                  {parseInt(response.gas_used).toLocaleString()}/
                  {parseInt(response.gas_wanted).toLocaleString()}
                </div>
              </div>
              {matchedLog && (
                <div className={s.row}>
                  <div className={s.head}>Action</div>
                  <div className={s.action}>
                    {matchedLog.map(log =>
                      log.transformed?.canonicalMsg.map((msg, key) =>
                        !msg.includes("undefined") ? (
                          <Action action={msg} key={key} />
                        ) : undefined
                      )
                    )}
                  </div>
                </div>
              )}
              <div className={s.row}>
                <div className={s.head}>Memo</div>
                <div className={s.body}>
                  {response.tx.value.memo ? response.tx.value.memo : "-"}
                </div>
              </div>
              <div className={s.row}>
                <div className={s.head}>Message</div>
                <div className={s.body}>
                  {response.tx.value.msg.map((msg, index) => (
                    <MsgBox
                      msg={msg}
                      log={response.logs?.[index]}
                      key={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      }}
    </WithFetch>
  );
};

export default Txs;
