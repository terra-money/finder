import React, { useState } from "react";
import format from "../../scripts/format";
import WithFetch from "../../HOCs/WithFetch";
import Finder from "../../components/Finder";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import Amount from "../../components/Amount";

interface DelegationEvent {
  height: string;
  type: string;
  amount: CoinData;
  timestamp: string;
}

type DelegationsEvents = Pagination & { events: DelegationEvent[] };

const Delegations = ({ address }: { address: string }) => {
  const [page, setPage] = useState<string>("1");

  const renderHead = () => (
    <tr>
      <th>Height</th>
      <th>Type</th>
      <th className="text-right">Change</th>
      <th className="text-right">Time</th>
    </tr>
  );

  const renderEvent = (event: DelegationEvent, index: number) =>
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
    );

  return (
    <WithFetch
      url={`/v1/staking/validators/${address}/delegations`}
      params={{ page }}
    >
      {({ events, ...pagination }: DelegationsEvents) => (
        <Pagination {...pagination} title="claim" action={setPage}>
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
