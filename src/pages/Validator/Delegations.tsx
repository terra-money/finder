import React, { useState } from "react";
import format from "../../scripts/format";
import WithFetch from "../../HOCs/WithFetch";
import Finder from "../../components/Finder";
import Pagination, { PaginationProps } from "../../components/Pagination";
import Table from "../../components/Table";
import Amount from "../../components/Amount";

interface DelegationEvent {
  height: string;
  type: string;
  amount: CoinData;
  timestamp: string;
}

type DelegationsEvents = { events: DelegationEvent[] } & PaginationProps;

const renderHead = () => (
  <tr>
    <th>Height</th>
    <th>Type</th>
    <th className="text-right">Change</th>
    <th className="text-right">Time</th>
  </tr>
);

const renderEvent = (event: DelegationEvent, index: number) => {
  console.log("renderEvent", event);
  return (
    event && (
      <tr key={index}>
        <td>
          <Finder q="blocks">{event.height}</Finder>
        </td>
        <td>{event.type}</td>
        <td className="text-right">
          <Amount>{event.amount.amount}</Amount>
        </td>
        <td className="text-right">{format.date(event.timestamp)}</td>
      </tr>
    )
  );
};

const Delegations = ({ address }: { address: string }) => {
  const [offset, setOffset] = useState<number>(0);

  return (
    <WithFetch
      url={`/v1/staking/validators/${address}/delegations`}
      params={{ offset }}
    >
      {({ events, ...pagination }: DelegationsEvents) => (
        <Pagination {...pagination} title="delegations" action={setOffset}>
          <Table>
            <thead>{renderHead()}</thead>
            <tbody>{events.map(renderEvent)}</tbody>
          </Table>
        </Pagination>
      )}
    </WithFetch>
  );
};

export default Delegations;
