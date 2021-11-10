import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { isEmpty } from "lodash";
import {
  LogFinderAmountResult,
  getTxAmounts,
  createLogMatcherForAmounts
} from "@terra-money/log-finder-ruleset";
import Pagination from "../../components/Pagination";
import FlexTable from "../../components/FlexTable";
import Card from "../../components/Card";
import Info from "../../components/Info";
import Icon from "../../components/Icon";
import Finder from "../../components/Finder";
import Loading from "../../components/Loading";
import Coin from "../../components/Coin";
import { useCurrentChain } from "../../contexts/ChainsContext";
import {
  fromISOTime,
  sliceMsgType,
  splitCoinData
} from "../../scripts/utility";
import format from "../../scripts/format";
import { plus } from "../../scripts/math";
import { LogfinderAmountRuleSet } from "../../store/LogfinderRuleSetStore";
import useFCD from "../../hooks/useFCD";
import TxAmount from "../Tx/TxAmount";
import s from "./Txs.module.scss";

type Fee = {
  denom: string;
  amount: string;
};

const getTxFee = (prop: Fee) =>
  prop && `${format.amount(prop.amount)} ${format.denom(prop.denom)}`;

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

const getMultiSendAmount = (
  matchedLogs: LogFinderAmountResult[],
  address: string,
  amountIn: JSX.Element[],
  amountOut: JSX.Element[]
) => {
  const amountInMap = new Map<string, string>();
  const amountOutMap = new Map<string, string>();

  matchedLogs.forEach(log => {
    const recipient = log.match[0].value;
    const coin = log.match[1].value.split(",").map(splitCoinData);

    coin.forEach(data => {
      if (data) {
        const { amount, denom } = data;
        const amountInStack = amountInMap.get(denom);
        const amountOutStack = amountOutMap.get(denom);

        const inStack = amountInStack ? plus(amountInStack, amount) : amount;
        const outStack = amountOutStack ? plus(amountOutStack, amount) : amount;

        if (recipient === address) {
          amountInMap.set(denom, inStack);
        } else {
          amountOutMap.set(denom, outStack);
        }
      }
    });
  });

  amountInMap.forEach((amount, denom) =>
    amountIn.push(<Coin amount={amount} denom={denom} />)
  );

  amountOutMap.forEach((amount, denom) =>
    amountOut.push(<Coin amount={amount} denom={denom} />)
  );
};

const getAmount = (address: string, matchedMsg?: LogFinderAmountResult[][]) => {
  const amountIn: JSX.Element[] = [];
  const amountOut: JSX.Element[] = [];
  matchedMsg?.forEach(matchedLog => {
    if (matchedLog && matchedLog[0]?.transformed?.type === "multiSend") {
      getMultiSendAmount(matchedLog, address, amountIn, amountOut);
    } else {
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
    }
  });

  //amount row limit
  return [amountIn.slice(0, 3), amountOut.slice(0, 3)];
};

const Txs = ({ address }: { address: string }) => {
  const { chainID } = useCurrentChain();
  const [offset, setOffset] = useState<number>(0);

  const { data, isLoading } = useFCD<{ next: number; txs: TxResponse[] }>(
    "/v1/txs",
    offset,
    100,
    address
  );
  const [txsRow, setTxsRow] = useState<JSX.Element[][]>([]);

  const ruleArray = useRecoilValue(LogfinderAmountRuleSet);
  const logMatcher = useMemo(
    () => createLogMatcherForAmounts(ruleArray),
    [ruleArray]
  );

  useEffect(() => {
    if (data?.txs) {
      const txRow = data.txs.map(tx => {
        const matchedLogs = getTxAmounts(
          JSON.stringify(tx),
          logMatcher,
          address
        );
        return getRow(tx, chainID, address, matchedLogs);
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
  matchedMsg?: LogFinderAmountResult[][]
) => {
  const { tx: txBody, txhash, height, timestamp, chainId } = response;
  const isSuccess = !response.code;
  const [amountIn, amountOut] = getAmount(address, matchedMsg);
  const fee = getTxFee(txBody?.value?.fee?.amount?.[0]);
  const feeData = fee?.split(" ");

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
    <span>
      {<TxAmount amount={feeData?.[0]} denom={feeData?.[1]} isFormatAmount />}
    </span>
  ];
};
