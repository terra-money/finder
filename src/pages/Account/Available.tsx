import React from "react";
import format from "../../scripts/format";
import { isIbcDenom } from "../../scripts/utility";
import AmountCard from "./AmountCard";
import IBCUnit from "./IBCUnit";

type Props = {
  denom: string;
  available: string;
  response?: Currency;
};

const Available = ({ denom, available, response }: Props) => {
  if (isIbcDenom(denom)) {
    return <IBCUnit denom={denom} available={available} />;
  }

  return (
    <AmountCard
      denom={format.denom(denom)}
      amount={available}
      response={response}
    />
  );
};

export default Available;
