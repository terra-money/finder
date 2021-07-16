import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isEmpty } from "lodash";
import { Coin } from "@terra-money/terra.js";
import WithFetch from "../../HOCs/WithFetch";
import FlexTable from "../../components/FlexTable";
import Pagination, { PaginationProps } from "../../components/Pagination";
import Loading from "../../components/Loading";
import Info from "../../components/Info";
import Card from "../../components/Card";
import Icon from "../../components/Icon";
import Finder from "../../components/Finder";
import CoinComponent from "../../components/Coin";
import { fromISOTime, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";
import NetworkContext from "../../contexts/NetworkContext";
import { LogFindersRuleSet } from "../../logfinder/types";
import { getMatchLog } from "../../logfinder/format";
import { LogfinderRuleSet } from "../../store/LogfinderRuleSetStore";
import s from "./Txs.module.scss";

type Fee = {
  denom: string;
  amount: string;
};

const TerraAddressRegExp = /(terra[0-9][a-z0-9]{38})/g;

const getTxFee = (prop: Fee) =>
  prop && `${format.amount(prop.amount)} ${format.denom(prop.denom)}`;

const formatAmount = (amount: string) => {
  try {
    const coinData = Coin.fromString(amount);
    return (
      <CoinComponent
        amount={coinData.amount.toString()}
        denom={coinData.denom}
      />
    );
  } catch {
    const res = amount.match(TerraAddressRegExp)?.[0];
    const value = amount.split(TerraAddressRegExp)[0];

    return res && <CoinComponent amount={value} denom={res} />;
  }
};

const getAmount = (
  txResponse: TxResponse,
  ruleArray: LogFindersRuleSet[],
  address: string
) => {
  const tx = JSON.stringify(txResponse);
  const matchLogs = getMatchLog(tx, ruleArray, address);
  const amountIn: JSX.Element[] = [];
  const amountOut: JSX.Element[] = [];

  if (matchLogs) {
    matchLogs.forEach(msg => {
      if (msg.transformed?.amountIn) {
        msg.transformed?.amountIn.split(",").forEach(amount => {
          const coin = formatAmount(amount.trim());
          coin && amountIn.push(coin);
        });
      }
      if (msg.transformed?.amountOut) {
        msg.transformed?.amountOut.split(",").forEach(amount => {
          const coin = formatAmount(amount.trim());
          coin && amountOut.push(coin);
        });
      }
    });
  }
  //amount row limit
  return [amountIn.slice(0, 3), amountOut.slice(0, 3)];
};

const Txs = ({
  address,
  search
}: {
  address: string;
  search: string;
  pathname: string;
}) => {
  const { network } = useContext(NetworkContext);
  const ruleArray = useRecoilValue(LogfinderRuleSet);
  const history = useHistory();
  const searchParams = new URLSearchParams(search);
  const offset = +(searchParams.get("offset") || 0);

  const goNext = (offset: number) => {
    searchParams.set("offset", `${offset}`);
    history.push({ search: searchParams.toString() });
  };

  const getRow = (response: TxResponse) => {
    const { tx: txBody, txhash, height, timestamp, chainId } = response;
    const isSuccess = !response.code;
    const [amountIn, amountOut] = getAmount(response, ruleArray, address);
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
    <WithFetch
      url={`/v1/txs`}
      params={{ offset, limit: 100, account: address, chainId: network }}
      loading={<Loading />}
    >
      {({ txs, next }: { txs: TxResponse[] } & PaginationProps) => {
        if (!isEmpty(txs)) {
          return (
            <Pagination next={next} title="transaction" action={goNext}>
              <FlexTable
                head={head}
                body={txs.map(getRow)}
                tableStyle={{ border: "none" }}
                headStyle={{ background: "none" }}
              />
            </Pagination>
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
  );
};

export default Txs;
