import { useEffect, useMemo, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "react-query";
import { get, last, isEmpty } from "lodash";
import { useRecoilValue } from "recoil";
import {
  getTxCanonicalMsgs,
  createLogMatcherForActions
} from "@terra-money/log-finder-ruleset";
import apiClient from "../../apiClient";
import Finder from "../../components/Finder";
import MsgBox from "../../components/MsgBox";
import Copy from "../../components/Copy";
import { fromISOTime, fromNow } from "../../scripts/utility";
import { LogfinderActionRuleSet } from "../../store/LogfinderRuleSetStore";
import Action from "./Action";
import Pending from "./Pending";
import s from "./Tx.module.scss";
import Searching from "./Searching";
import TxAmount from "./TxAmount";
import TxTax from "./TxTax";
import { useCurrentChain, useFCDURL } from "../../contexts/ChainsContext";

type Coin = {
  amount: string;
  denom: string;
};

const Txs = ({ match }: RouteComponentProps<{ hash: string }>) => {
  const { hash } = match.params;
  const ruleArray = useRecoilValue(LogfinderActionRuleSet);
  const logMatcher = useMemo(
    () => createLogMatcherForActions(ruleArray),
    [ruleArray]
  );
  const { data: response, progressState } = usePollTxHash(hash);

  if (!response) {
    return <Searching state={progressState} hash={hash} />;
  }

  const isPending = !response?.height;
  const matchedMsg = getTxCanonicalMsgs(JSON.stringify(response), logMatcher);

  const fee: Coin[] = get(response, "tx.value.fee.amount");
  const tax: string[] = response.logs
    ?.map(log => get(log, "log.tax"))
    .filter(data => typeof data === "string" && data !== "")
    .flat();

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
        {fee?.length ? (
          <div className={s.row}>
            <div className={s.head}>Transaction fee</div>
            <div className={s.body}>
              {fee.map((fee, key) => (
                <TxAmount index={key} {...fee} key={key} />
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}

        {isPending ? (
          <></>
        ) : (
          <>
            {!isEmpty(tax) && (
              <div className={s.row}>
                <div className={s.head}>Tax</div>
                <div className={s.body}>
                  <TxTax tax={tax} />
                </div>
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
  const { chainID } = useCurrentChain();
  const fcdURL = useFCDURL();

  const [stored, setStored] = useState<TxResponse>();
  const [progress, setProgress] = useState<number>(0);

  /* polling tx */
  const [refetchTx, setRefetchTx] = useState<boolean>(true);

  /* polling mempool tx */
  const [refetchMempool, setRefetchMempool] = useState<boolean>(true);

  /* query: tx */
  const { refetch, ...txQuery } = useQuery(
    [chainID, txhash, "tx"],
    () => apiClient.get<TxResponse>(fcdURL + `/v1/tx/${txhash}`),
    {
      refetchInterval: INTERVAL,
      refetchOnWindowFocus: false,
      enabled: refetchTx,
      onSuccess: data => data.data && setStored(data.data)
    }
  );

  /* query: mempool tx */
  const mempoolQuery = useQuery(
    [chainID, txhash, "mempool"],
    () => apiClient.get<TxResponse>(fcdURL + `/v1/mempool/${txhash}`),
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

    setProgress(state => (state + 0.0333) % 1);
  }, [mempoolQuery.data, txQuery.data]);

  // TODO: Reset store, progress and refetch tx when hash, network changed

  return {
    data: stored,
    progressState: progress
  };
};
