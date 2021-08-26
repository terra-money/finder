import React, { useEffect, useMemo, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "react-query";
import { get, last, isArray, isObject, isEmpty } from "lodash";
import { useRecoilValue } from "recoil";
import apiClient from "../../apiClient";
import NotFound from "../../components/NotFound";
import Finder from "../../components/Finder";
import MsgBox from "../../components/MsgBox";
import Copy from "../../components/Copy";
import Loading from "../../components/Loading";
import { useNetwork } from "../../HOCs/WithFetch";
import format from "../../scripts/format";
import { getMatchMsg } from "../../logfinder/format";
import { createLogMatcher } from "../../logfinder/execute";
import { fcdUrl } from "../../scripts/utility";
import { fromISOTime, fromNow, sliceMsgType } from "../../scripts/utility";
import { LogfinderRuleSet } from "../../store/LogfinderRuleSetStore";
import Action from "./Action";
import Pending from "./Pending";
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

  const { data: response, isLoading, error } = usePollTxHash(hash);

  if (isLoading) return <Loading />;
  if (error || !response) return <NotFound keyword={hash} />;

  const matchedMsg = getMatchMsg(JSON.stringify(response), logMatcher);
  const isPending = response.height ? false : true;

  return (
    <>
      <h2 className="title">Transaction Details</h2>
      {isPending && <Pending timestamp={response.timestamp} />}

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
            {isPending ? (
              <span className={s.pending}>Pending</span>
            ) : !response.code ? (
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
        {isPending ? (
          <></>
        ) : (
          <div className={s.row}>
            <div className={s.head}>Block</div>
            <div className={s.body}>
              <Finder q="blocks" v={response.height}>
                {response.height}
              </Finder>
            </div>
          </div>
        )}
        <div className={s.row}>
          {isPending ? (
            <>
              <div className={s.head}>Last Seen</div>
              <div className={s.body}>
                {fromNow(response.timestamp.toString())}
              </div>
            </>
          ) : (
            <>
              <div className={s.head}>Timestamp</div>
              <div className={s.body}>
                {fromISOTime(response.timestamp.toString())}
              </div>
            </>
          )}
        </div>
        <div className={s.row}>
          <div className={s.head}>Transaction fee</div>
          <div className={s.body}>{getTotalFee(response)}</div>
        </div>
        {isPending ? (
          <></>
        ) : (
          <>
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
          </>
        )}

        {!isEmpty(matchedMsg?.flat()) && (
          <div className={s.row}>
            <div className={s.head}>Action</div>
            <div className={s.action}>
              {matchedMsg?.map(matchedLog =>
                matchedLog.map(log =>
                  log.transformed?.canonicalMsg.map((msg, key) => {
                    return !msg.includes("undefined") ? (
                      <Action action={msg} key={key} />
                    ) : undefined;
                  })
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
              <MsgBox msg={msg} log={response.logs?.[index]} key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Txs;

/* hooks */
export const usePollTxHash = (txhash: string) => {
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false);
  const network = useNetwork();
  const fcd = fcdUrl(network);
  const { data, isLoading, error } = useQuery(
    [network, txhash],
    () => apiClient.get(fcd + `/v1/tx/${txhash}`),
    { refetchInterval, enabled: !!txhash }
  );

  const result: TxResponse = data?.data;
  const height = result && result.height;

  useEffect(() => {
    if (height) {
      setRefetchInterval(false);
    } else {
      setRefetchInterval(1000);
    }
  }, [height]);

  return { data: result, isLoading, error };
};
