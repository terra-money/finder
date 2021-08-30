import { useEffect, useMemo, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "react-query";
import { get, last, isArray, isObject, isEmpty } from "lodash";
import { useRecoilValue } from "recoil";
import apiClient from "../../apiClient";
import Finder from "../../components/Finder";
import MsgBox from "../../components/MsgBox";
import Copy from "../../components/Copy";
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
import Searching from "./Searching";

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
  const amount = get(txResponse, "tx.value.fee.amount");

  if (!amount) {
    return `0 Luna`;
  }

  const result: { [key: string]: string } = {};

  amount.forEach((a: CoinData) => {
    if (!isObject(a)) {
      return;
    }

    result[a.denom] = a.amount;
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

const Txs = ({ match }: RouteComponentProps<{ hash: string }>) => {
  const { hash } = match.params;
  const ruleArray = useRecoilValue(LogfinderRuleSet);
  const logMatcher = useMemo(() => createLogMatcher(ruleArray), [ruleArray]);
  const { data: response, progressState } = usePollTxHash(hash);

  if (!response) {
    return <Searching state={progressState} hash={hash} />;
  }

  const isPending = !response?.height;
  const matchedMsg =
    response && getMatchMsg(JSON.stringify(response), logMatcher);

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
                  log.transformed?.canonicalMsg.map((msg, key) =>
                    !msg.includes("undefined") ? (
                      <Action action={msg} key={key} />
                    ) : undefined
                  )
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
const INTERVAL = 1000;

const usePollTxHash = (txhash: string) => {
  const network = useNetwork();
  const fcd = fcdUrl(network);

  const [stored, setStored] = useState<TxResponse>();
  const [progress, setProgress] = useState<number>(0);

  /* polling tx */
  const [refetchTx, setRefetchTx] = useState<boolean>(true);

  /* polling mempool tx */
  const [refetchMempool, setRefetchMempool] = useState<boolean>(true);

  /* query: tx */
  const { refetch, ...txQuery } = useQuery(
    [network, txhash, "tx"],
    () => apiClient.get<TxResponse>(fcd + `/v1/tx/${txhash}`),
    {
      refetchInterval: INTERVAL,
      refetchOnWindowFocus: false,
      enabled: refetchTx,
      onSuccess: data => data.data && setStored(data.data)
    }
  );

  /* query: mempool tx */
  const mempoolQuery = useQuery(
    [network, txhash, "mempool"],
    () => apiClient.get<TxResponse>(fcd + `/v1/mempool/${txhash}`),
    {
      refetchInterval: INTERVAL,
      refetchOnWindowFocus: false,
      enabled: refetchMempool,
      onSuccess: data => data.data && setStored(data.data)
    }
  );

  // if tx not exists(null or no height), start polling mempool tx
  useEffect(() => {
    if (txQuery.data?.data) {
      setRefetchTx(false);
      setRefetchMempool(false);
    }

    if (mempoolQuery.data?.data) {
      setRefetchMempool(false);
    }

    setProgress(state => state + 0.0333);
  }, [mempoolQuery.data, txQuery.data]);

  useEffect(() => {
    // Reset store, progress and refetch tx when hash, network changed
    setProgress(0);
    setStored(undefined);
    setRefetchTx(true);
    setRefetchMempool(true);
  }, [txhash, network]);

  return {
    data: stored,
    progressState: progress
  };
};
