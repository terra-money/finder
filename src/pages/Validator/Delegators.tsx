import React, { useState } from "react";
import format from "../../scripts/format";
import WithFetch from "../../HOCs/WithFetch";
import Finder from "../../components/Finder";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import Amount from "../../components/Amount";
import { percent } from "../../scripts/math";

interface Delegator {
  address: string;
  amount: string;
  weight: string;
}

type Delegators = Pagination & { delegators: Delegator[] };

const Delegators = ({ address }: { address: string }) => {
  const [page, setPage] = useState<string>("1");

  const renderHead = () => (
    <tr>
      <th>Account</th>
      <th className="text-right">Amount</th>
      <th className="text-right">Weight</th>
    </tr>
  );

  const renderDelegator = (delegator: Delegator, index: number) =>
    delegator && (
      <tr key={index}>
        <td>
          <Finder q="account" v={delegator.address}>
            {format.truncate(delegator.address, [6, 6])}
          </Finder>
        </td>
        <td className="text-right">
          <Amount>{delegator.amount}</Amount>
        </td>
        <td className="text-right">{percent(delegator.weight)}</td>
      </tr>
    );

  return (
    <WithFetch
      url={`/v1/staking/validators/${address}/delegators`}
      params={{ page }}
    >
      {({ delegators = [], ...pagination }: Delegators) => (
        <Pagination {...pagination} title="claim" action={setPage}>
          <Table>
            <thead>{renderHead()}</thead>
            <tbody>{delegators.map(renderDelegator)}</tbody>
          </Table>
        </Pagination>
      )}
    </WithFetch>
  );
};

export default Delegators;
