import React, { useState, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { get, isEmpty } from "lodash";
import s from "./Txs.module.scss";
import FlexTable from "../../components/FlexTable";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import Finder from "../../components/Finder";
import { fromNow, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";
import WithFetch from "../../HOCs/WithFetch";
import NetworkContext from "../../contexts/NetworkContext";

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
  const [page, setPage] = useState<string>("1");
  const { network } = useContext(NetworkContext);

  const { match } = props;
  const { height } = match.params;

  const head = [`TxHash`, `Type`, `Fee`, `Height`, `Time`];

  return (
    <div className={s.tableContainer}>
      <WithFetch
        url="/v1/txs"
        params={{ block: height, page, chainId: network }}
        loading={<Loading />}
      >
        {({ txs = [], ...pagination }: Pagination & { txs: TxResponse[] }) => (
          <>
            <h2 className="title">
              Transactions<span>for Block #{height}</span>
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
