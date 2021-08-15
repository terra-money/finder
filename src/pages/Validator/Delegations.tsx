import { Fragment, useEffect, useState } from "react";
import format from "../../scripts/format";
import Finder from "../../components/Finder";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import Amount from "../../components/Amount";
import useFCD from "../../hooks/useFCD";

interface DelegationEvent {
  height: string;
  type: string;
  amount: CoinData;
  timestamp: string;
}

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

type Response = {
  events: DelegationEvent[];
  next: number;
};

const Delegations = ({ address }: { address: string }) => {
  const [offset, setOffset] = useState<number>(0);
  const [next, setNext] = useState<number>(0);
  const [event, setEvent] = useState<JSX.Element[]>([]);

  const url = `/v1/staking/validators/${address}/delegations?offset=${offset}`;
  const { data } = useFCD<Response>(url);

  useEffect(() => {
    if (data) {
      const { events, next } = data;
      const element = events.map(renderEvent);
      setEvent(stack => [...stack, ...element]);
      setNext(next);
    }
  }, [data]);

  return (
    <Pagination next={next} title="delegations" action={setOffset}>
      <Table>
        <thead>{renderHead()}</thead>
        <tbody>
          {event.map((element, key) => (
            <Fragment key={key}>{element}</Fragment>
          ))}
        </tbody>
      </Table>
    </Pagination>
  );
};

export default Delegations;
