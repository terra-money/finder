import React, { useContext } from "react";
import WithFetch from "../../HOCs/WithFetch";
import FlexTable from "../../components/FlexTable";
import Pagination from "../../components/Pagination";
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
  denom: string;
  amount: string;
};

const getAmount = (prop: Amount) => {
  if (!prop) return "-";

  const { denom, amount } = prop;
  return <CoinComponent amount={amount} denom={denom} />;
};

const Txs = ({
  address,
  search,
  pathname
}: {
  address: string;
  search: string;
  pathname: string;
}) => {
  const { network } = useContext(NetworkContext);

  /* URLSearchParams: tab */
  const getSearch = () => new URLSearchParams(search);
  const getNextSearch = (entries: string[][]) => {
    const sp = getSearch();
    entries.forEach(([key, value]) =>
      value ? sp.set(key, value) : sp.delete(key)
    );

    return `?${sp.toString()}`;
  };
  const page = getSearch().get("page") || "1";

  /* helpers */
  const getLink = (page: string) => ({
    pathname,
    search: getNextSearch([["page", page]])
  });
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
        <span> ({chainId})</span>
      </span>,
      <span>{fromISOTime(timestamp.toString())} (UTC)</span>,
      <span>{getAmount(txBody.value.msg[0].value.amount?.[0])}</span>
    ];
  };

  const head = [`Tx hash`, `Type`, `Result`, `Block`, `Timestamp`, `Amount`];
  return (
    <WithFetch
      url={`/v1/txs`}
      params={{ page, limit: 100, account: address, chainId: network }}
      loading={<Loading />}
    >
      {({ txs, ...pagination }: Pagination & { txs: TxResponse[] }) =>
        !isEmpty(txs) ? (
          <Pagination {...pagination} title="transaction" link={getLink}>
            <FlexTable
              head={head}
              body={txs.map(getRow)}
              tableStyle={{ border: "none" }}
              headStyle={{ background: "none" }}
            ></FlexTable>
          </Pagination>
        ) : (
          <Card>
            <Info icon="info_outline" title="">
              No transactions yet
            </Info>
          </Card>
        )
      }
    </WithFetch>
  );
};

export default Txs;
