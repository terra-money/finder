import { useEffect, useState } from "react";
import format from "../../scripts/format";
import { percent } from "../../scripts/math";
import Finder from "../../components/Finder";
import Table from "../../components/Table";
import Amount from "../../components/Amount";
import Pagination from "../../components/Pagination";
import useFCD from "../../hooks/useFCD";

interface Delegator {
  address: string;
  amount: string;
  weight: string;
}

type Response = {
  delegators: Delegator[];
};
const Delegators = ({ address }: { address: string }) => {
  const [page, setPage] = useState<number | undefined>(1);
  const [delegators, setDelegators] = useState<JSX.Element[]>([]);

  const url = `/v1/staking/validators/${address}/delegators?page=${page}`;
  const { data } = useFCD<Response>(url);

  useEffect(() => {
    if (data) {
      if (data.delegators.length) {
        const elements = data.delegators.map(renderDelegator);
        setDelegators(stack => [...stack, ...elements]);
      } else {
        setPage(undefined);
      }
    }
  }, [data]);

  return (
    <Pagination
      next={page}
      title="delegator"
      action={() => setPage(pageNum => pageNum && pageNum + 1)}
    >
      <Table>
        <thead>{renderHead()}</thead>
        <tbody>{delegators}</tbody>
      </Table>
    </Pagination>
  );
};

export default Delegators;

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
