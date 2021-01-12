import React from "react";
import FlexTable from "../../components/FlexTable";
import s from "./Account.module.scss";

import Badge from "../../components/Badge";
import c from "classnames";
import { getBadgeClassName } from "../../scripts/helper";
import Card from "../../components/Card";
import Coin from "../../components/Coin";
import Finder from "../../components/Finder";
import { isEmpty } from "lodash";
import { BASE_DENOM } from "../../scripts/utility";

const Delegations = ({ staking }: { staking: Staking }) => {
  const getRow = (d: MyDelegation) => {
    const {
      amountDelegated,
      validatorName,
      rewards,
      validatorAddress,
      validatorStatus
    } = d;
    return [
      (() => (
        <span>
          <Finder q="validator" v={validatorAddress}>
            {validatorName}
          </Finder>
        </span>
      ))(),
      (() => (
        <span>
          <Badge className={c(getBadgeClassName(validatorStatus))}>
            {validatorStatus}
          </Badge>
        </span>
      ))(),
      (() => (
        <span>
          <Coin amount={amountDelegated} denom={BASE_DENOM} />
        </span>
      ))(),
      (() => (
        <div>
          {Array.isArray(rewards) && (
            <ul>
              {rewards.map((coin, index) => (
                <li key={index}>
                  <Coin {...coin} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))()
    ];
  };

  const head = [`Validator`, `Status`, `Amount`, `Rewards`];
  return !isEmpty(staking.myDelegations) ? (
    <Card title="Delegations" bordered headerClassName={s.cardTitle}>
      <div className={s.cardBodyContainer}>
        <FlexTable
          head={head}
          body={staking.myDelegations.map(getRow)}
          tableStyle={{ border: "none" }}
          headStyle={{ background: "none" }}
        ></FlexTable>
      </div>
    </Card>
  ) : null;
};

export default Delegations;
