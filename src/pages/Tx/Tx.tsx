import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Finder from "../../components/Finder";
import MsgBox from "../../components/MsgBox";
import Copy from "../../components/Copy";

import { get, isArray } from "lodash";

import s from "./Tx.module.scss";
import Loading from "../../components/Loading";
import WithFetch from "../../HOCs/WithFetch";
import { fromISOTime, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";

function isSendTx(tx: ITx) {
  const type = get(tx, "tx.value.msg[0].type");
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

function getTaxTotal(tx: ITx) {
  const result: { [key: string]: number } = {};
  const logs = get(tx, "logs");

  if (!isArray(logs)) {
    return ``;
  }

  logs.forEach(log => {
    if (!log || typeof log.log !== "string") {
      return;
    }

    const tax = JSON.parse(log.log).tax;

    if (!tax || typeof tax !== "string") {
      return;
    }

    const taxArray: string[] = tax.split(",");

    taxArray.forEach(tax => {
      const { amount, denom } = getAmountAndDenom(tax);

      if (denom) {
        result[denom] = amount + (result[denom] || 0);
      }
    });
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
      {(tx: ITx) => (
        <>
          <h2 className="title">Transaction Details</h2>

          <div className={s.list}>
            <div className={s.row}>
              <div className={s.head}>Transaction hash</div>
              <div className={s.body}>
                <div>
                  {tx.txhash}
                  <Copy
                    text={tx.txhash}
                    style={{ display: "inline-block", position: "absolute" }}
                  ></Copy>
                </div>
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Status</div>
              <div className={s.body}>
                {get(tx, "logs[0].success") ? (
                  <span className={s.success}>Success</span>
                ) : (
                  <>
                    <p className={s.fail}>Failed</p>
                    <p className={s.failedMsg}>
                      {get(tx, "logs[0].log") || get(tx, "raw_log")}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Block</div>
              <div className={s.body}>
                <Finder q="blocks" v={tx.height}>
                  {tx.height}
                </Finder>
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Timestamp</div>
              <div className={s.body}>
                {fromISOTime(tx.timestamp.toString())} (UTC)
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Transaction fee</div>
              <div className={s.body}>
                {tx.tx.value.fee.amount
                  ? format.coin({
                      amount: get(tx, `tx.value.fee.amount[0].amount`),
                      denom: get(tx, `tx.value.fee.amount[0].denom`)
                    })
                  : "0 Luna"}
              </div>
            </div>
            {isSendTx(tx) && (
              <div className={s.row}>
                <div className={s.head}>Tax</div>
                <div className={s.body}>{getTaxTotal(tx)}</div>
              </div>
            )}
            <div className={s.row}>
              <div className={s.head}>Gas (Used/Requested)</div>
              <div className={s.body}>
                {parseInt(tx.gas_used).toLocaleString()}/
                {parseInt(tx.gas_wanted).toLocaleString()}
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Memo</div>
              <div className={s.body}>
                {tx.tx.value.memo ? tx.tx.value.memo : "-"}
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Message</div>
              <div className={s.body}>
                <div style={{ overflowX: "hidden", width: "100%" }}>
                  {tx.tx.value.msg.map(MsgBox)}
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
