import { get, isEmpty } from "lodash";
import s from "./Txs.module.scss";
import FlexTable from "../../components/FlexTable";
import Info from "../../components/Info";
import Card from "../../components/Card";
import Finder from "../../components/Finder";
import { fromNow, sliceMsgType } from "../../scripts/utility";
import TxAmount from "../Tx/TxAmount";

const getRow = (response: TxResponse) => {
  const { txhash, tx, height, timestamp } = response;

  const fee = get(tx, `value.fee.amount[0]`);

  return [
    <span>
      <Finder q="tx" v={txhash}>
        {txhash}
      </Finder>
    </span>,
    <span className="type">{sliceMsgType(tx.value.msg[0].type)}</span>,
    <span>
      {isEmpty(tx.value.fee.amount) ? (
        "0 Luna"
      ) : (
        <TxAmount amount={fee.amount} denom={fee.denom} />
      )}
    </span>,
    <span>
      <Finder q="blocks" v={height}>
        {height}
      </Finder>
    </span>,
    <span>{fromNow(timestamp.toString())}</span>
  ];
};

const Txs = ({ txs }: { txs: TxResponse[] }) => {
  const head = [`TxHash`, `Type`, `Fee`, `Height`, `Time`];

  return (
    <div className={s.tableContainer}>
      {txs.length ? (
        <FlexTable head={head} body={txs.map(getRow)} />
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
