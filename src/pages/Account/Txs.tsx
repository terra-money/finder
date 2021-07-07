import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";
import WithFetch from "../../HOCs/WithFetch";
import FlexTable from "../../components/FlexTable";
import Pagination, { PaginationProps } from "../../components/Pagination";
import Loading from "../../components/Loading";
import Info from "../../components/Info";
import Card from "../../components/Card";
import Icon from "../../components/Icon";
import Finder from "../../components/Finder";
import { fromISOTime, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";
import NetworkContext from "../../contexts/NetworkContext";
import s from "./Txs.module.scss";

type Fee = {
  denom: string;
  amount: string;
};

const getTxFee = (prop: Fee) =>
  prop && `${format.amount(prop.amount)} ${format.denom(prop.denom)}`;

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
      <span>{fromISOTime(timestamp.toString())}</span>,
      <span>{getTxFee(txBody?.value?.fee?.amount?.[0])}</span>
    ];
  };
  const head = [`Tx hash`, `Type`, `Block`, `Timestamp`, `Fee`];
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
