import React, { useState } from "react";
import format from "../../scripts/format";
import WithFetch from "../../HOCs/WithFetch";
import OldPagination from "../../components/OldPagination";
import Finder from "../../components/Finder";
import Table from "../../components/Table";
import Coin from "../../components/Coin";

interface Claim {
  tx: string;
  type: string;
  amounts: CoinData[];
  timestamp: string;
}

const Claims = ({ address }: { address: string }) => {
  const [page, setPage] = useState<string>("1");

  const renderHead = () => (
    <tr>
      <th>Tx</th>
      <th>Type</th>
      <th className="text-right">Amount</th>
      <th className="text-right">Time</th>
    </tr>
  );

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

  return (
    <WithFetch
      url={`/v1/staking/validators/${address}/claims`}
      params={{ page }}
    >
      {({ claims = [], ...pagination }) => (
        <OldPagination {...pagination} title="claim" action={setPage}>
          <Table>
            <thead>{renderHead()}</thead>
            <tbody>{claims.map(renderClaim)}</tbody>
          </Table>
        </OldPagination>
      )}
    </WithFetch>
  );
};

export default Claims;
