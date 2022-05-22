import React from "react";
import format from "../../scripts/format";
import { isIbcDenom } from "../../scripts/utility";
import AmountCard from "./AmountCard";
import IBCUnit from "./IBCUnit";

type Props = {
  denom: string;
  amount: string;
  response?: Currency;
};

const Available = ({ denom, amount, response }: Props) => {
  if (isIbcDenom(denom)) {
    return <IBCUnit denom={denom} available={amount} />;
  }

  return (
    <AmountCard
      denom={format.denom(denom)}
      amount={amount}
      response={response}
    />
  );
};

export default Available;
