import React from "react";
import { isEmpty } from "lodash";

import format from "../../scripts/format";
import Table from "../../components/Table";
import Amount from "../../components/Amount";
import Card from "../../components/Card";
import NoDataYet from "../../components/NoDataYet";

const Rewards = ({ title, list }: { title: string; list: IReward[] }) => (
  <Card title={title} bordered>
    {!isEmpty(list) ? (
      <Table>
        <thead>
          <tr>
            <th>Coin</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {list.map(({ denom, amount }, index) => (
            <tr key={index}>
              <td>{format.denom(denom)}</td>
              <td className="text-right">
                <Amount>{amount}</Amount>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <NoDataYet context={title} />
    )}
  </Card>
);

export default Rewards;
