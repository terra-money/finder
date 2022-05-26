import React, { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { ContractInfo as Props } from "@terra-money/terra.js";
import Flex from "../../components/Flex";
import Card from "../../components/Card";
import Table from "../../components/Table";
import WasmMsg from "../../components/WasmMsg";
import ModalWithButton from "../../components/ModalWithButton";
import Txs from "./Txs";
import Query from "./Query";
import Undelegations from "./Undelegations";
import CopyAddress from "./CopyAddress";
import Delegations from "./Delegations";
import ContractInfo from "./ContractInfo";
import TokenBalance from "./TokenBalance";
import s from "./Contract.module.scss";

const Contract = ({ admin, code_id, init_msg, label }: Props) => {
  const { address = "" } = useParams();

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
          { th: "Label", td: label }
        ])}

        <h3 className={s.h3}>Contract</h3>
        {renderTable([
          { th: "InitMsg", td: init_msg && <WasmMsg msg={init_msg} /> },
          { th: "Admin", td: admin }
        ])}
      </Card>

      <TokenBalance address={address} />

      <Delegations address={address} />
      <Undelegations address={address} />
      <Txs address={address} />
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
