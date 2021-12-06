import React from "react";
import { isEmpty } from "lodash";

import Table from "../../components/Table";
import Amount from "../../components/Amount";
import Card from "../../components/Card";
import NoMoreData from "../../components/NoMoreData";
import Denom from "../../components/Denom";

const Rewards = ({ title, list }: { title: string; list: Reward[] }) => (
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
              <td>
                <Denom denom={denom} />
              </td>
              <td className="text-right">
                <Amount>{amount}</Amount>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <NoMoreData context={title} />
    )}
  </Card>
);

export default Rewards;
