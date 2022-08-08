import { useEffect, useMemo, useState } from "react";
import { get, isEmpty } from "lodash";
import {
  LogFinderAmountResult,
  getTxAmounts,
  createLogMatcherForAmounts
} from "@terra-money/log-finder-ruleset";
import { TxInfo } from "@terra-money/terra.js";
import Pagination from "../../components/Pagination";
import FlexTable from "../../components/FlexTable";
import Card from "../../components/Card";
import Info from "../../components/Info";
import Icon from "../../components/Icon";
import Finder from "../../components/Finder";
import Loading from "../../components/Loading";
import Coin from "../../components/Coin";
import { useCurrentChain, useIsClassic } from "../../contexts/ChainsContext";
import {
  fromISOTime,
  sliceMsgType,
  splitCoinData,
  getTaxData
} from "../../scripts/utility";
import format from "../../scripts/format";
import { useLogfinderAmountRuleSet } from "../../hooks/useLogfinder";
import useRequest from "../../hooks/useRequest";
import { useGetQueryURL } from "../../queries/query";
import TxAmount from "../Tx/TxAmount";
import { transformTx } from "../Tx/transform";
import CsvExport from "./CSVExport";
import s from "./Txs.module.scss";

type Fee = {
  denom: string;
  amount: string;
};

export const getTxFee = (prop: Fee, isClassic?: boolean) =>
  prop &&
  `${format.amount(prop.amount)} ${format.denom(prop.denom, isClassic)}`;

const getRenderAmount = (
  amountList: string[] | undefined,
  amountArray: JSX.Element[]
) => {
  amountList?.forEach(amount => {
    const coin = splitCoinData(amount.trim());
    if (coin) {
      const { amount, denom } = coin;
      const element = <Coin amount={amount} denom={denom} />;

      amountArray.push(element);
    }
  });
};

const getAmount = (
  address: string,
  matchedMsg?: LogFinderAmountResult[][],
  rowLimit?: number
) => {
  const amountIn: JSX.Element[] = [];
  const amountOut: JSX.Element[] = [];
  matchedMsg?.forEach(matchedLog => {
    matchedLog?.forEach(log => {
      const amounts = log.transformed?.amount?.split(",");
      const sender = log.transformed?.sender;
      const recipient = log.transformed?.recipient;

      if (address === sender) {
        getRenderAmount(amounts, amountOut);
      }

      if (address === recipient) {
        getRenderAmount(amounts, amountIn);
      }
    });
  });

  //amount row limit
  if (rowLimit) {
    return [amountIn.slice(0, 3), amountOut.slice(0, 3)];
  }

  return [amountIn, amountOut];
};

const Txs = ({ address }: { address: string }) => {
  const { chainID } = useCurrentChain();
  const [offset, setOffset] = useState<number>(0);
  const isClassic = useIsClassic();

  const params = { offset, limit: 100, account: address };
  const url = useGetQueryURL("/v1/txs");
  const { data, isLoading } = useRequest<{
    next: number;
    txs: TxInfo[];
  }>({ url, params });

  const [txsRow, setTxsRow] = useState<JSX.Element[][]>([]);

  const ruleSet = useLogfinderAmountRuleSet();
  const logMatcher = useMemo(
    () => createLogMatcherForAmounts(ruleSet),
    [ruleSet]
  );

  useEffect(() => {
    if (data?.txs) {
      const txRow = data.txs.map((tx: any) => {
        const txData: TxResponse = transformTx(tx, chainID);
        const matchedLogs = getTxAmounts(
          JSON.stringify(txData),
          logMatcher,
          address
        );
        return getRow(txData, chainID, address, matchedLogs, isClassic);
      });
      setTxsRow(stack => [...stack, ...txRow]);
    }
    // eslint-disable-next-line
  }, [data, chainID, address]);

  const head = [
    `Tx hash`,
    `Type`,
    `Block`,
    `Amount (Out)`,
    `Amount (In)`,
    `Timestamp`,
    `Fee`,
    isClassic ? "Tax" : ""
  ];

  return (
    <Card title="Transactions" bordered headerClassName={s.cardTitle}>
      {!isEmpty(txsRow) ? (
        <div className={s.exportCsvWrapper}>
          <CsvExport address={address} />
        </div>
      ) : null}

      <Pagination
        next={data?.next}
        title="transaction"
        action={setOffset}
        loading={isLoading}
      >
        <div className={s.cardBodyContainer}>
          {isEmpty(txsRow) && isLoading ? (
            <Loading />
          ) : !isEmpty(txsRow) ? (
            <FlexTable
              head={head}
              body={txsRow}
              tableStyle={{ border: "none" }}
              headStyle={{ background: "none" }}
            />
          ) : (
            <Card>
              <Info icon="info_outline" title="">
                No more transactions
              </Info>
            </Card>
          )}
        </div>
      </Pagination>
    </Card>
  );
};

export default Txs;

const getRow = (
  response: TxResponse,
  network: string,
  address: string,
  matchedMsg?: LogFinderAmountResult[][],
  isClassic?: boolean
) => {
  const { tx: txBody, txhash, height, timestamp, chainId, logs } = response;
  const isSuccess = !response.code;
  const [amountIn, amountOut] = getAmount(address, matchedMsg, 3);
  const fee = getTxFee(txBody?.value?.fee?.amount?.[0], isClassic);
  const feeData = fee?.split(" ");
  const tax = get(logs, "[1].log.tax") || get(logs, "[0].log.tax");
  const taxData = getTaxData(tax);
  return [
    <span>
      <div className={s.wrapper}>
        <Finder q="tx" network={network} v={txhash}>
          {format.truncate(txhash, [8, 8])}
        </Finder>
        {isSuccess ? (
          <Icon name="check" className={s.success} />
        ) : (
          <Icon name="warning" className={s.fail} />
        )}
      </div>
    </span>,
    <span className="type">{sliceMsgType(txBody?.value?.msg[0].type)}</span>,
    <span>
      <Finder q="blocks" network={network} v={String(height)}>
        {String(height)}
      </Finder>
      <span>({chainId})</span>
    </span>,
    <span className={s.amount}>
      {amountOut.length
        ? amountOut.map((amount, index) => {
            if (index >= 2) {
              return <Finder q="tx" v={txhash} children="..." key={index} />;
            } else {
              return <span key={index}>-{amount}</span>;
            }
          })
        : "-"}
    </span>,
    <span className={s.amount}>
      {amountIn.length
        ? amountIn.map((amount, index) => {
            if (index >= 2) {
              return <Finder q="tx" v={txhash} children="..." key={index} />;
            } else {
              return <span key={index}>+{amount}</span>;
            }
          })
        : "-"}
    </span>,
    <span>{fromISOTime(timestamp.toString())}</span>,
    <span>
      <TxAmount
        amount={feeData?.[0]}
        denom={feeData?.[1]}
        isFormatAmount={true}
      />
    </span>,
    <span className={s.amount}>
      {taxData && isClassic ? (
        <span>
          <Coin amount={taxData.amount} denom={taxData.denom} />
        </span>
      ) : (
        ""
      )}
    </span>
  ];
};
