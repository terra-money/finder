import React from "react";
import Amount from "./Amount";

const Coin = ({ amount, denom }: ICoin) => (
  <Amount denom={denom}>{amount}</Amount>
);

export default Coin;
