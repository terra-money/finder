import React, { useState } from "react";
import format from "../../scripts/format";
import WithFetch from "../../HOCs/WithFetch";
import Finder from "../../components/Finder";
import OldPagination, {
  OldPaginationProps
} from "../../components/OldPagination";
import Table from "../../components/Table";
import Amount from "../../components/Amount";

interface DelegationEvent {
  height: string;
  type: string;
  amount: CoinData;
  timestamp: string;
}

type DelegationsEvents = OldPaginationProps & { events: DelegationEvent[] };

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
  const [page, setPage] = useState<string>("1");

  return (
    <WithFetch
      url={`/v1/staking/validators/${address}/delegations`}
      params={{ page }}
    >
      {({ events, ...pagination }: DelegationsEvents) => (
        <OldPagination
          {...pagination}
          count={events.length}
          title="delegations"
          action={setPage}
        >
          <Table>
            <thead>{renderHead()}</thead>
            <tbody>{events.map(renderEvent)}</tbody>
          </Table>
        </OldPagination>
      )}
    </WithFetch>
  );
};

export default Delegations;
