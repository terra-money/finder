import React from "react";
import Amount from "./Amount";

const Coin = ({ amount, denom }: CoinData) => (
  <Amount denom={denom}>{amount}</Amount>
);

export default Coin;
