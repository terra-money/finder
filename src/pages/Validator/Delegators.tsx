import React, { useState } from "react";
import format from "../../scripts/format";
import WithFetch from "../../HOCs/WithFetch";
import Finder from "../../components/Finder";
import OldPagination, {
  OldPaginationProps
} from "../../components/OldPagination";
import Table from "../../components/Table";
import Amount from "../../components/Amount";
import { percent } from "../../scripts/math";

interface Delegator {
  address: string;
  amount: string;
  weight: string;
}

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
      {({
        delegators = [],
        ...pagination
      }: { delegators: Delegator[] } & OldPaginationProps) => (
        <OldPagination
          {...pagination}
          count={delegators.length}
          title="delegator"
          action={setPage}
        >
          <Table>
            <thead>{renderHead()}</thead>
            <tbody>{delegators.map(renderDelegator)}</tbody>
          </Table>
        </OldPagination>
      )}
    </WithFetch>
  );
};

export default Delegators;
