import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Finder from "../../components/Finder";
import MsgBox from "../../components/MsgBox";
import Copy from "../../components/Copy";

import { get, isEmpty } from "lodash";

import s from "./Tx.module.scss";
import Loading from "../../components/Loading";
import WithFetch from "../../HOCs/WithFetch";
import { fromISOTime, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";

const Txs = (props: RouteComponentProps<{ hash: string }>) => {
  const { match } = props;
  const { hash } = match.params;

  function isSend(tx: ITx) {
    const type = get(tx, "tx.value.msg[0].type");
    return [`MsgMultiSend`, `MsgSend`].includes(sliceMsgType(type));
  }

  function taxString(tx: ITx) {
    function taxNumber(tax: string) {
      return parseInt(tax).toString() || ``;
    }

    function taxDenom(taxNumber: string, tax: string) {
      const length = taxNumber.length;
      if (!tax || !taxNumber) return ``;
      return tax.slice(length);
    }

    const result: { [key: string]: number } = {};
    const logs = get(tx, "logs");

    if (isEmpty(logs)) return ``;

    logs.map(log => {
      if (!log.log) return null;
      const tax = get(JSON.parse(log.log), "tax");
      const taxArray: string[] = tax.split(",");

      taxArray.map(tax => {
        const denom = taxDenom(taxNumber(tax), tax);
        result[denom] = Number(taxNumber(tax)) + Number(result[denom] || 0);
        return null;
      });
      return null;
    });
    if (isEmpty(result)) return ``;
    const resultArr = Object.keys(result).map(key => {
      return `${format.coin({
        amount: result[key].toString(),
        denom: key
      })} `;
    });
    console.log(resultArr.join(","));
    return resultArr.join(",");
  }
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
            {isSend(tx) && (
              <div className={s.row}>
                <div className={s.head}>Tax</div>
                <div className={s.body}>{taxString(tx)}</div>
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
