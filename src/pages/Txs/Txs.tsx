import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { get, isEmpty } from "lodash";
import s from "./Txs.module.scss";
import FlexTable from "../../components/FlexTable";
import Pagination from "../../components/Pagination";
import Info from "../../components/Info";
import Card from "../../components/Card";
import Finder from "../../components/Finder";
import { fromNow, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";
import useFCD from "../../hooks/useFCD";
import { useNetwork } from "../../HOCs/WithFetch";

const getRow = (response: TxResponse) => {
  const { txhash, tx, height, timestamp } = response;
  return [
    <span>
      <Finder q="tx" v={txhash}>
        {txhash}
      </Finder>
    </span>,
    <span className="type">{sliceMsgType(tx.value.msg[0].type)}</span>,
    <span>
      {isEmpty(tx.value.fee.amount)
        ? "0 Luna"
        : format.coin({
            amount: get(tx, `value.fee.amount[0].amount`),
            denom: get(tx, `value.fee.amount[0].denom`)
          })}
    </span>,
    <span>
      <Finder q="blocks" v={height}>
        {height}
      </Finder>
    </span>,
    <span>{fromNow(timestamp.toString())}</span>
  ];
};

const Txs = (props: RouteComponentProps<{ height: string }>) => {
  const { height } = props.match.params;

  const [txList, setTxList] = useState<JSX.Element[][]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [next, setNext] = useState<number>(0);
  const url = `/v1/txs?block=${height}&offset=${offset}`;
  const { data } = useFCD<{ next: number; txs: TxResponse[] }>(url);

  const network = useNetwork();

  useEffect(() => {
    if (data) {
      const { next, txs } = data;
      const element = txs.map(getRow);

      setTxList(stack => [...stack, ...element]);
      setNext(next);
    }
  }, [data]);

  useEffect(() => {
    setTxList([]);
  }, [network]);

  const head = [`TxHash`, `Type`, `Fee`, `Height`, `Time`];

  return (
    <div className={s.tableContainer}>
      {txList.length ? (
        <>
          <h2 className="title">
            Transactions<span>for Block #{height}</span>
          </h2>
          <Pagination next={next} title="translation" action={setOffset}>
            <FlexTable head={head} body={txList} />
          </Pagination>
        </>
      ) : (
        <Card>
          <Info icon="info_outline" title="">
            No more transactions
          </Info>
        </Card>
      )}
    </div>
  );
};

export default Txs;
