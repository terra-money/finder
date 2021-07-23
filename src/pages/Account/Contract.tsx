import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import format from "../../scripts/format";
import WithFetch from "../../HOCs/WithFetch";
import useTokenBalance from "../../hooks/cw20/useTokenBalance";
import Flex from "../../components/Flex";
import Info from "../../components/Info";
import Card from "../../components/Card";
import Table from "../../components/Table";
import ExtLink from "../../components/ExtLink";
import Loading from "../../components/Loading";
import WasmMsg from "../../components/WasmMsg";
import ModalWithButton from "../../components/ModalWithButton";
import Txs from "./Txs";
import Query from "./Query";
import Unbondings from "./Unbondings";
import AmountCard from "./AmountCard";
import CopyAddress from "./CopyAddress";
import Delegations from "./Delegations";
import AvailableList from "./AvailableList";
import ContractInfo from "./ContractInfo";
import s from "./Contract.module.scss";

const Contract = ({ address, admin, code, info, ...data }: Contract) => {
  const { init_msg, migrate_msg, timestamp, migratable, code_id } = data;
  const link = code?.info.url && (
    <ExtLink href={code?.info.url}>{code?.info.url}</ExtLink>
  );

  const tokens = useTokenBalance(address);
  const { search, pathname } = useLocation();
  const migratableValue = migratable !== undefined && String(migratable);

  return (
    <>
      <h2 className="title">Smart Contract</h2>
      <ContractInfo address={address} />
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
          { th: "InitMsg", td: init_msg && <WasmMsg msg={init_msg} /> },
          {
            th: "MigrateMsg",
            td: migrate_msg && <WasmMsg msg={migrate_msg} />
          },
          { th: "Timestamp", td: timestamp && format.date(timestamp) },
          { th: "Migratable", td: migratableValue },
          { th: "Admin", td: admin }
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
                  denom={t.symbol}
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
