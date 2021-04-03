import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import WithFetch from "../../HOCs/WithFetch";
import FlexTable from "../../components/FlexTable";
import Pagination, { PaginationProps } from "../../components/Pagination";
import Loading from "../../components/Loading";
import Info from "../../components/Info";
import Card from "../../components/Card";
import Finder from "../../components/Finder";
import CoinComponent from "../../components/Coin";
import { isEmpty } from "lodash";
import { fromISOTime, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";
import NetworkContext from "../../contexts/NetworkContext";
import s from "./Txs.module.scss";

type Amount = {
  amount: [
    {
      amount: string;
      denom: string;
    }
  ];
  from_address: string;
};

const getAmount = (prop: Amount, address: string) => {
  if (!prop.amount?.[0]) return "-";

  const { denom, amount } = prop.amount[0];
  const from_address = prop.from_address;

  return (
    <>
      {from_address === address ? "-" : "+"}
      <CoinComponent amount={amount} denom={denom} />
    </>
  );
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
    return [
      <span>
        <Finder q="tx" network={network} v={txhash}>
          {format.truncate(txhash, [8, 8])}
        </Finder>
      </span>,
      <span className="type">{sliceMsgType(txBody.value.msg[0].type)}</span>,
      <span className={isSuccess ? s.success : s.fail}>
        {isSuccess ? `Success` : `Failed`}
      </span>,
      <span>
        <Finder q="blocks" network={network} v={height}>
          {height}
        </Finder>
        <span>({chainId})</span>
      </span>,
      <span>{fromISOTime(timestamp.toString())}</span>,
      <span>{getAmount(txBody.value.msg[0].value, address)}</span>
    ];
  };

  const head = [`Tx hash`, `Type`, `Result`, `Block`, `Timestamp`, `Amount`];
  return (
    <WithFetch
      url={`/v1/txs`}
      params={{ offset, limit: 100, account: address, chainId: network }}
      loading={<Loading />}
    >
      {({ txs, next }: { txs: TxResponse[] } & PaginationProps) => {
        // TODO: getting nextOffset from txs will be deprecated.
        const nextOffset = next || (txs.length && txs[txs.length - 1].id);

        if (!isEmpty(txs)) {
          return (
            <Pagination next={nextOffset} title="transaction" action={goNext}>
              <FlexTable
                head={head}
                body={txs.map(getRow)}
                tableStyle={{ border: "none" }}
                headStyle={{ background: "none" }}
              ></FlexTable>
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
