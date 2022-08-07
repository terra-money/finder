import { get, isEmpty } from "lodash";
import { TxInfo } from "@terra-money/terra.js";
import FlexTable from "../../components/FlexTable";
import Info from "../../components/Info";
import Card from "../../components/Card";
import Finder from "../../components/Finder";
import { fromNow, sliceMsgType, splitCoinData } from "../../scripts/utility";
import TxAmount from "../Tx/TxAmount";
import { transformTx } from "../Tx/transform";
import { useCurrentChain, useIsClassic } from "../../contexts/ChainsContext";
import s from "./Txs.module.scss";
import Coin from "../../components/Coin";

const getRow = (response: TxInfo, chainID: string, isClassic?: boolean) => {
  const transformed = transformTx(response, chainID);
  const { txhash, tx, height, timestamp, logs } = transformed;
  const fee = get(tx, `value.fee.amount[0]`);
  const tax = isClassic
    ? splitCoinData(
        get(logs, "[1].log.tax") || (get(logs, "[0].log.tax") as string)
      ) || "0"
    : "0";
  return [
    <span>
      <Finder q="tx" v={txhash}>
        {txhash}
      </Finder>
    </span>,
    <span className="type">{sliceMsgType(tx?.value?.msg[0].type)}</span>,
    <span>
      {isEmpty(fee) ? (
        `0 ${isClassic ? "Lunc" : "Luna"}`
      ) : (
        <TxAmount amount={fee.amount} denom={fee.denom} />
      )}
    </span>,
    <span>
      <Finder q="blocks" v={String(height)}>
        {String(height)}
      </Finder>
    </span>,
    <span>{fromNow(timestamp.toString())}</span>,
    <span className={s.amount}>
      {tax !== "0" ? (
        <span>
          <Coin amount={tax.amount} denom={tax.denom} />
        </span>
      ) : (
        ""
      )}
    </span>
  ];
};

const Txs = ({ txs }: { txs: TxInfo[] }) => {
  const isClassic = useIsClassic();
  const head = [
    `TxHash`,
    `Type`,
    `Fee`,
    `Height`,
    `Time`,
    isClassic ? `Tax` : ``
  ];
  const { chainID } = useCurrentChain();
  return (
    <div className={s.tableContainer}>
      {txs.length ? (
        <FlexTable
          head={head}
          body={txs.map(tx => getRow(tx, chainID, isClassic))}
        />
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
