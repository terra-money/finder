import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { get } from "lodash";
import s from "./Txs.module.scss";
import FlexTable from "../../components/FlexTable";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import Finder from "../../components/Finder";
import { fromNow, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";
import WithFetch from "../../HOCs/WithFetch";

const Txs = (props: RouteComponentProps<{ block: string }>) => {
  const [page, setPage] = useState<string>("1");

  const { match } = props;
  const { block } = match.params;

  const head = [`TxHash`, `Type`, `Fee`, `Height`, `Time`];

  const getRow = (Tx: ITx) => {
    const { txhash, tx, height, timestamp } = Tx;
    return [
      <span>
        <Finder q="tx" v={txhash}>
          {txhash}
        </Finder>
      </span>,
      <span className="type">{sliceMsgType(tx.value.msg[0].type)}</span>,
      <span>
        {tx.value.fee.amount
          ? format.coin({
              amount: get(tx, `value.fee.amount[0].amount`),
              denom: get(tx, `value.fee.amount[0].denom`)
            })
          : "0 Luna"}
      </span>,
      <span>
        <Finder q="blocks" v={height}>
          {height}
        </Finder>
      </span>,
      <span>{fromNow(timestamp.toString())}</span>
    ];
  };

  return (
    <div className={s.tableContainer}>
      <WithFetch url="/v1/txs" params={{ block, page }} loading={<Loading />}>
        {({ txs = [], ...pagination }: ITxs) => (
          <>
            <h2 className="title">
              Transactions<span>for Block #{block}</span>
            </h2>
            <p className={s.description}>
              A total of {pagination.totalCnt} transactions found
            </p>
            <Pagination {...pagination} title="translation" action={setPage}>
              <FlexTable head={head} body={txs.map(getRow)} />
            </Pagination>
          </>
        )}
      </WithFetch>
    </div>
  );
};

export default Txs;
