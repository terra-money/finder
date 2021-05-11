import React from "react";
import format from "../../scripts/format";
import AmountCard from "./AmountCard";

type Props = {
  denom: string;
  available: string;
  currency: Currency;
};

const Available = ({ denom, available, currency }: Props) => (
  <AmountCard
    denom={format.denom(denom)}
    amount={available}
    currency={currency}
  />
);

export default Available;
