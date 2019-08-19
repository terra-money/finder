import React from "react";

import WithFetch from "../../HOCs/WithFetch";
import FlexTable from "../../components/FlexTable";
import Pagination from "../../components/Pagination";
import Info from "../../components/Info";
import Card from "../../components/Card";
import Finder from "../../components/Finder";
import { isEmpty, get } from "lodash";
import { fromISOTime, sliceMsgType } from "../../scripts/utility";
import format from "../../scripts/format";
import c from "classnames";
import s from "./Account.module.scss";

export default (address: string, search: string, pathname: string) => {
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
  const getRow = (tx: ITx) => {
    const { tx: txBody, txhash, height, timestamp } = tx;
    const isSuccess = get(tx, "logs[0].success");
    return [
      <span>
        <Finder q="tx" v={txhash}>
          {format.truncate(txhash, [8, 8])}
        </Finder>
      </span>,
      <span className="type">{sliceMsgType(txBody.value.msg[0].type)}</span>,
      <span className={c(isSuccess ? s.success : s.fail)}>
        {isSuccess ? `Success` : `Failed`}
      </span>,
      <span>
        <Finder q="blocks" v={height}>
          {height}
        </Finder>
      </span>,
      <span>{fromISOTime(timestamp.toString())} (UTC)</span>
    ];
  };

  const head = [`Tx hash`, `Type`, `Result`, `Block`, `Timestamp`];
  return (
    <WithFetch url={`/v1/txs`} params={{ account: address, page }}>
      {({ txs, ...pagination }: Pagination & { txs: ITx[] }) =>
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
