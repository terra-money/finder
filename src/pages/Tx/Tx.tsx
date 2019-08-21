import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { get, isArray, isObject } from "lodash";
import Finder from "../../components/Finder";
import MsgBox from "../../components/MsgBox";
import Copy from "../../components/Copy";
import s from "./Tx.module.scss";
import Loading from "../../components/Loading";
import WithFetch from "../../HOCs/WithFetch";
import { fromISOTime, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";

function isSendTx(response: TxResponse) {
  const type = get(response, "tx.value.msg[0].type");
  return [`MsgMultiSend`, `MsgSend`].includes(sliceMsgType(type));
}

function getAmountAndDenom(tax: string) {
  const result = /\d+/.exec(tax);

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

export function getTotalTax(txResponse: TxResponse) {
  const logs = get(txResponse, "logs");

  if (!isArray(logs)) {
    return ``;
  }

  const result: { [key: string]: number } = {};

  logs.forEach(log => {
    if (!isObject(log) || typeof log.log !== "string" || log.log.length === 0) {
      return;
    }

    try {
      const tax = JSON.parse(log.log).tax;

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
    return ``;
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

const Txs = (props: RouteComponentProps<{ hash: string }>) => {
  const { match } = props;
  const { hash } = match.params;

  return (
    <WithFetch url={`/txs/${hash}`} loading={<Loading />}>
      {(response: TxResponse) => (
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
                  ></Copy>
                </div>
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Status</div>
              <div className={s.body}>
                {get(response, "logs[0].success") ? (
                  <span className={s.success}>Success</span>
                ) : (
                  <>
                    <p className={s.fail}>Failed</p>
                    <p className={s.failedMsg}>
                      {get(response, "logs[0].log") || get(response, "raw_log")}
                    </p>
                  </>
                )}
              </div>
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
                {fromISOTime(response.timestamp.toString())} (UTC)
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Transaction fee</div>
              <div className={s.body}>
                {response.tx.value.fee.amount
                  ? format.coin({
                      amount: get(response, `tx.value.fee.amount[0].amount`),
                      denom: get(response, `tx.value.fee.amount[0].denom`)
                    })
                  : "0 Luna"}
              </div>
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
            <div className={s.row}>
              <div className={s.head}>Memo</div>
              <div className={s.body}>
                {response.tx.value.memo ? response.tx.value.memo : "-"}
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Message</div>
              <div className={s.body}>
                <div style={{ overflowX: "hidden", width: "100%" }}>
                  {response.tx.value.msg.map(MsgBox)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </WithFetch>
  );
};

export default Txs;
