import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import { get, isEmpty } from "lodash";
import s from "./Txs.module.scss";
import FlexTable from "../../components/FlexTable";
import Pagination, { PaginationProps } from "../../components/Pagination";
import Loading from "../../components/Loading";
import Info from "../../components/Info";
import Card from "../../components/Card";
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

const Txs = (
  props: RouteComponentProps<{ height: string; offset: string }>
) => {
  const { height } = props.match.params;
  const { network } = useContext(NetworkContext);
  const history = useHistory();
  const searchParams = new URLSearchParams(props.location.search);
  const offset = +(searchParams.get("offset") || 0);

  const next = (offset: number) => {
    searchParams.set("offset", `${offset}`);
    history.push({ search: searchParams.toString() });
  };

  const head = [`TxHash`, `Type`, `Fee`, `Height`, `Time`];

  return (
    <div className={s.tableContainer}>
      <WithFetch
        url="/v1/txs"
        params={{ block: height, offset, chainId: network }}
        loading={<Loading />}
      >
        {({ txs = [] }: { txs: TxResponse[] } & PaginationProps) => {
          if (!isEmpty(txs)) {
            const nextOffset = txs.length && txs[txs.length - 1].id;

            return (
              <>
                <h2 className="title">
                  Transactions<span>for Block #{height}</span>
                </h2>
                <Pagination offset={nextOffset} title="translation" next={next}>
                  <FlexTable head={head} body={txs.map(getRow)} />
                </Pagination>
              </>
            );
          } else {
            return (
              <Card>
                <Info icon="info_outline" title="">
                  No more transactions
                </Info>
              </Card>
            );
          }
        }}
      </WithFetch>
    </div>
  );
};

export default Txs;
