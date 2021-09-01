import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import Pagination from "../../components/Pagination";
import FlexTable from "../../components/FlexTable";
import Card from "../../components/Card";
import Info from "../../components/Info";
import Icon from "../../components/Icon";
import Finder from "../../components/Finder";
import Loading from "../../components/Loading";
import Coin from "../../components/Coin";
import {
  fromISOTime,
  sliceMsgType,
  splitCoinData
} from "../../scripts/utility";
import format from "../../scripts/format";
import { plus } from "../../scripts/math";
import { AmountLogFinderResult } from "../../logfinder/types";
import { getMatchAmount, useAmountLogMatcher } from "../../logfinder/format";
import useFCD from "../../hooks/useFCD";
import { useNetwork } from "../../HOCs/WithFetch";
import s from "./Txs.module.scss";

type Fee = {
  denom: string;
  amount: string;
};

const getTxFee = (prop: Fee) =>
  prop && `${format.amount(prop.amount)} ${format.denom(prop.denom)}`;

const getRenderAmount = (amountList: string[], amountArray: JSX.Element[]) => {
  amountList?.forEach(amount => {
    const coin = splitCoinData(amount.trim());
    if (coin) {
      const { amount, denom } = coin;
      const element = <Coin amount={amount} denom={denom} />;
      amountArray.push(element);
    }
  });
};

const getMultiSendAmount = (
  matchedLogs: AmountLogFinderResult[],
  address: string,
  amountIn: JSX.Element[],
  amountOut: JSX.Element[]
) => {
  const amountInMap = new Map<string, string>();
  const amountOutMap = new Map<string, string>();
  matchedLogs.forEach(log => {
    if (log.transformed) {
      const { recipient, amount } = log.transformed;
      const coin = amount?.split(",").map(splitCoinData);
      coin.forEach(data => {
        if (data) {
          const { amount, denom } = data;
          const amountIn = amountInMap.get(denom);
          const amountOut = amountOutMap.get(denom);
          const inStack = amountIn ? plus(amountIn, amount) : amount;
          const outStack = amountOut ? plus(amountOut, amount) : amount;
          if (recipient === address) {
            amountInMap.set(denom, inStack);
          } else {
            amountOutMap.set(denom, outStack);
          }
        }
      });
    }
  });
  amountInMap.forEach((amount, denom) =>
    amountIn.push(<Coin amount={amount} denom={denom} />)
  );
  amountOutMap.forEach((amount, denom) =>
    amountOut.push(<Coin amount={amount} denom={denom} />)
  );
};

const getAmount = (address: string, matchedMsg?: AmountLogFinderResult[]) => {
  const amountIn: JSX.Element[] = [];
  const amountOut: JSX.Element[] = [];

  if (matchedMsg) {
    for (const matchedLog of matchedMsg) {
      if (matchedLog.transformed) {
        const { sender, recipient, amount, type } = matchedLog.transformed;
        const amounts = amount?.split(",");

        if (type === "multiSend") {
          getMultiSendAmount(matchedMsg, address, amountIn, amountOut);
          return [amountIn, amountOut];
        } else {
          if (address === sender) {
            getRenderAmount(amounts, amountOut);
          }
          if (address === recipient) {
            getRenderAmount(amounts, amountIn);
          }
        }
      }
    }
  }
  //amount row limit
  return [amountIn.slice(0, 3), amountOut.slice(0, 3)];
};

const Txs = ({ address }: { address: string }) => {
  const network = useNetwork();
  const [offset, setOffset] = useState<number>(0);

  const { data, isLoading } = useFCD<{ next: number; txs: TxResponse[] }>(
    "/v1/txs",
    offset,
    100,
    address
  );
  const [txsRow, setTxsRow] = useState<JSX.Element[][]>([]);

  const logMatcher = useAmountLogMatcher();
  useEffect(() => {
    if (data?.txs) {
      const txRow = data.txs.map(tx => {
        const matchedLogs = getMatchAmount(
          JSON.stringify(tx),
          logMatcher,
          address
        );
        return getRow(tx, network, address, matchedLogs);
      });
      setTxsRow(stack => [...stack, ...txRow]);
    }

    return () => {};
  }, [data, network, logMatcher, address]);

  const head = [
    `Tx hash`,
    `Type`,
    `Block`,
    `Amount (Out)`,
    `Amount (In)`,
    `Timestamp`,
    `Fee`
  ];

  return (
    <Card title="Transactions" bordered headerClassName={s.cardTitle}>
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
  matchedMsg?: AmountLogFinderResult[]
) => {
  const { tx: txBody, txhash, height, timestamp, chainId } = response;
  const isSuccess = !response.code;
  const [amountIn, amountOut] = getAmount(address, matchedMsg);

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
    <span className="type">{sliceMsgType(txBody.value.msg[0].type)}</span>,
    <span>
      <Finder q="blocks" network={network} v={height}>
        {height}
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
    <span>{getTxFee(txBody?.value?.fee?.amount?.[0])}</span>
  ];
};
