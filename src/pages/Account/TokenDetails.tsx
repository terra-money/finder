import React, { ReactNode, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Dictionary } from "ramda";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Loading from "../../components/Loading";
import WithFetch from "../../HOCs/WithFetch";
import tokens from "../../hooks/cw20/tokens.json";
import { Tokens } from "../../hooks/cw20/useTokenBalance";
import NetworkContext from "../../contexts/NetworkContext";
import Txs from "./Txs";
import s from "./TokenDetails.module.scss";

const TokenDetails = () => {
  const { address = "" } = useParams<{ address: string }>();
  const { search, pathname } = useLocation();
  const { network: currentChain } = useContext(NetworkContext);
  const whitelist = (tokens as Dictionary<Tokens>)[currentChain];
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
