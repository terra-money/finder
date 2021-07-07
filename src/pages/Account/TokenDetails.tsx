import React, { ReactNode } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import { Whitelist } from "../../store/WhitelistStore";
import WithFetch from "../../HOCs/WithFetch";
import Txs from "./Txs";
import s from "./TokenDetails.module.scss";

const TokenDetails = () => {
  const { address = "" } = useParams<{ address: string }>();
  const { search, pathname } = useLocation();
  const whitelist = useRecoilValue(Whitelist);
  const size = { width: 32, height: 32 };

  return (
    <WithFetch
      url={`/wasm/contracts/${address}/store?query_msg={"token_info":{}}`}
      loading={<Loading />}
    >
      {({ result: { name, symbol } }) => {
        const icon = whitelist[address] && (
          <img src={whitelist[address].icon} alt={name} {...size} />
        );

        return (
          <>
            <h1 className="title">Token Profile</h1>

            {renderTable([
              { th: "Icon", td: icon },
              { th: "Name", td: name },
              { th: "Symbol", td: symbol }
            ])}

            <Card title="Transactions" bordered headerClassName={s.cardTitle}>
              <div className={s.cardBodyContainer}>
                <Txs address={address} search={search} pathname={pathname} />
              </div>
            </Card>
          </>
        );
      }}
    </WithFetch>
  );
};

export default TokenDetails;

const renderTable = (
  data: { th: string | ReactNode; td: string | ReactNode }[]
) => (
  <Table wrapperClassName={s.wrapper} className={s.table}>
    <tbody>
      {data.map(({ th, td }, index) =>
        !td ? null : (
          <tr key={index}>
            <th>{th}</th>
            <td>{td}</td>
          </tr>
        )
      )}
    </tbody>
  </Table>
);
