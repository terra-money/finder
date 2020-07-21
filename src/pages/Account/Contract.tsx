import React, { ReactNode } from "react";
import format from "../../scripts/format";
import Card from "../../components/Card";
import Table from "../../components/Table";
import s from "./Account.module.scss";

const Contract = ({ contract_address, code, info, ...data }: Contract) => {
  const { init_msg, timestamp, migratable } = data;

  return (
    <Card title="Contract" bordered headerClassName={s.cardTitle}>
      <h3 className={s.h3}>Code</h3>
      {renderTable([
        { th: "ID", td: code.code_id },
        { th: "Name", td: code.info.name },
        { th: "Description", td: code.info.description },
        { th: "Repo URL", td: code.info.url }
      ])}

      <h3 className={s.h3}>Contract</h3>
      {renderTable([
        { th: "Name", td: info.name },
        { th: "Description", td: info.description },
        { th: "InitMsg", td: renderCodes(init_msg) },
        { th: "Timestamp", td: format.date(timestamp) },
        { th: "Migrate", td: String(migratable) }
      ])}
    </Card>
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
    const node = <pre>{JSON.stringify(JSON.parse(codes), null, 2)}</pre>;
    return node;
  } catch (error) {
    return null;
  }
};
