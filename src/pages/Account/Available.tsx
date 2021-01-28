import React from "react";
import format from "../../scripts/format";
import AmountCard from "./AmountCard";

const Available = ({ denom, available }: Balance) => (
  <AmountCard denom={format.denom(denom)} amount={available} />
);

export default Available;
