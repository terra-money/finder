import { useEffect, useState } from "react";
import format from "../../scripts/format";
import Pagination from "../../components/Pagination";
import Finder from "../../components/Finder";
import Table from "../../components/Table";
import Coin from "../../components/Coin";
import useFCD from "../../hooks/useFCD";

interface Claim {
  tx: string;
  type: string;
  amounts: CoinData[];
  timestamp: string;
}

const renderClaim = (claim: Claim, index: number) =>
  claim && (
    <tr key={index}>
      <td>
        <Finder q="tx" v={claim.tx}>
          {format.truncate(claim.tx, [14, 13])}
        </Finder>
      </td>

      <td>{claim.type}</td>

      <td className="text-right">
        {Array.isArray(claim.amounts) && (
          <ul>
            {claim.amounts.map((coin, index) => (
              <li key={index}>
                <Coin {...coin} />
              </li>
            ))}
          </ul>
        )}
      </td>

      <td className="text-right">{format.date(claim.timestamp)}</td>
    </tr>
  );

type Response = {
  limit: number;
  claims: Claim[];
  next: number;
};

const Claims = ({ address }: { address: string }) => {
  const [offset, setOffset] = useState<number>(0);
  const [next, setNext] = useState<number>(0);
  const [claims, setClaims] = useState<Claim[]>([]);

  const url = `/v1/staking/validators/${address}/claims`;
  const { data } = useFCD<Response>(url, offset);

  useEffect(() => {
    if (data) {
      const { claims, next } = data;
      setClaims(stack => [...stack, ...claims]);
      setNext(next);
    }
  }, [data]);

  const renderHead = () => (
    <tr>
      <th>Tx</th>
      <th>Type</th>
      <th className="text-right">Amount</th>
      <th className="text-right">Time</th>
    </tr>
  );

  return (
    <Pagination next={next} title="claims" action={setOffset}>
      <Table>
        <thead>{renderHead()}</thead>
        <tbody>{claims.map(renderClaim)}</tbody>
      </Table>
    </Pagination>
  );
};

export default Claims;
