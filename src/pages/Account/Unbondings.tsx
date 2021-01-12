import React from "react";
import FlexTable from "../../components/FlexTable";
import Finder from "../../components/Finder";
import s from "./Account.module.scss";

import Card from "../../components/Card";
import Badge from "../../components/Badge";
import c from "classnames";
import { getBadgeClassName } from "../../scripts/helper";
import { isEmpty } from "lodash";
import { fromISOTime } from "../../scripts/utility";
import Coin from "../../components/Coin";

import { BASE_DENOM } from "../../scripts/utility";

const Unbondings = ({ staking }: { staking: Staking }) => {
  const getRow = (u: Undelegation) => {
    const {
      amount,
      releaseTime,
      validatorName,
      validatorAddress,
      validatorStatus,
      creationHeight
    } = u;
    return [
      (() => (
        <span>
          <Finder q="validator" v={validatorAddress}>
            {validatorName}
          </Finder>
          &nbsp;&nbsp;
          <Badge className={c(getBadgeClassName(validatorStatus))}>
            {validatorStatus}
          </Badge>
        </span>
      ))(),
      (() => (
        <span>
          <Finder q="blocks" v={creationHeight}>
            {creationHeight}
          </Finder>
        </span>
      ))(),
      (() => (
        <span>
          <Coin amount={amount} denom={BASE_DENOM} />
        </span>
      ))(),
      (() => <span>{fromISOTime(releaseTime)}</span>)()
    ];
  };
  const head = [`Validator`, `Block`, `Amount`, `Release time`];
  return !isEmpty(staking.undelegations) ? (
    <Card title="Undelegations" bordered headerClassName={s.cardTitle}>
      <div className={s.cardBodyContainer}>
        <FlexTable
          head={head}
          body={staking.undelegations.map(getRow)}
          tableStyle={{ border: "none" }}
          headStyle={{ background: "none" }}
        ></FlexTable>
      </div>
    </Card>
  ) : null;
};

export default Unbondings;
