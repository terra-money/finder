import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import format from "../../scripts/format";
import { decodeBase64 } from "../../scripts/utility";
import WithFetch, { useNetwork } from "../../HOCs/WithFetch";
import useTokenBalance from "../../hooks/cw20/useTokenBalance";
import Card from "../../components/Card";
import Table from "../../components/Table";
import ExtLink from "../../components/ExtLink";
import Info from "../../components/Info";
import Loading from "../../components/Loading";
import Flex from "../../components/Flex";
import ModalWithButton from "../../components/ModalWithButton";
import CopyAddress from "./CopyAddress";
import Txs from "./Txs";
import AvailableList from "./AvailableList";
import AmountCard from "./AmountCard";
import Query from "./Query";
import s from "./Contract.module.scss";
import Delegations from "./Delegations";
import Unbondings from "./Unbondings";

const Contract = ({ address, code, info, ...data }: Contract) => {
  const { init_msg, timestamp, code_id } = data;
  const link = code?.info.url && (
    <ExtLink href={code?.info.url}>{code?.info.url}</ExtLink>
  );

  const network = useNetwork();
  const tokens = useTokenBalance(address);
  const { search, pathname } = useLocation();

  return (
    <>
      <h2 className="title">Smart Contract</h2>

      <WithFetch
        url={`/wasm/contracts/${address}/store?query_msg={"token_info":{}}`}
        loading={<Loading />}
        renderError={() => null}
      >
        <Card className={s.cardTitle}>
          <h1>This smart contract is a token.</h1>
          <Link to={`/${network}/token/${address}`}>View token profile</Link>
        </Card>
      </WithFetch>

      <CopyAddress>{address}</CopyAddress>

      <Card
        title={
          <Flex>
            Contract
            <ModalWithButton buttonLabel="Query" modalContent={<Query />} />
          </Flex>
        }
        bordered
        headerClassName={s.cardTitle}
      >
        <h3 className={s.h3}>Code</h3>
        {renderTable([
          { th: "ID", td: code_id },
          { th: "Name", td: code?.info.name },
          { th: "Description", td: code?.info.description },
          { th: "Repo URL", td: link }
        ])}

        <h3 className={s.h3}>Contract</h3>
        {renderTable([
          { th: "Name", td: info?.name },
          { th: "Description", td: info?.description },
          { th: "InitMsg", td: renderCodes(init_msg) },
          { th: "Timestamp", td: timestamp && format.date(timestamp) }
        ])}
      </Card>

      <WithFetch url={`/v1/bank/${address}`} loading={<Loading />}>
        {({ balance }: Account) => (
          <Card title="Available" bordered headerClassName={s.cardTitle}>
            {balance.length ? (
              <div className={s.cardBodyContainer}>
                <AvailableList list={balance} />
              </div>
            ) : (
              <Card>
                <Info icon="info_outline" title="">
                  This account doesn't hold any coins yet.
                </Info>
              </Card>
            )}
          </Card>
        )}
      </WithFetch>

      {tokens?.list?.filter(t => t.balance !== "0").length ? (
        <Card title="Tokens" bordered headerClassName={s.cardTitle}>
          <div className={s.cardBodyContainer}>
            {tokens.list
              .filter(t => t.balance !== "0")
              .map((t, i) => (
                <AmountCard
                  key={i}
                  denom={t.name}
                  amount={t.balance}
                  icon={t.icon}
                />
              ))}
          </div>
        </Card>
      ) : undefined}

      <WithFetch url={`/v1/staking/${address}`}>
        {(staking: Staking) => (
          <>
            <Delegations staking={staking} />
            <Unbondings staking={staking} />
          </>
        )}
      </WithFetch>

      <Card title="Transactions" bordered headerClassName={s.cardTitle}>
        <div className={s.cardBodyContainer}>
          <Txs address={address} search={search} pathname={pathname} />
        </div>
      </Card>
    </>
  );
};

export default Contract;

/* table */
const renderTable = (data: { th: string; td: ReactNode }[]) => (
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

const renderCodes = (codes: string): ReactNode => {
  try {
    const node = (
      <pre>{JSON.stringify(JSON.parse(decodeBase64(codes)), null, 2)}</pre>
    );
    return node;
  } catch (error) {
    return null;
  }
};
