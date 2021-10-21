import React from "react";
import { Fragment } from "react";
import { useProps } from "./helpers/NetworkProvider";
import Coin from "./Coin";

const Coins = ({ children }: { children: string }) => {
  const { config } = useProps();

  if (children.endsWith(","))
    return (
      <>
        <Coin>{children.slice(0, -1)}</Coin>,
      </>
    );

  const coins = children.split(",");

  if (coins.length > 1 && !config?.showAllCoins)
    return <strong>multiple coins</strong>;

  return (
    <>
      {coins.map((coin, i) => (
        <Fragment key={`fg-${i.toString()}`}>
          {!!i && ", "}
          <Coin>{coin}</Coin>
        </Fragment>
      ))}
    </>
  );
};

export default Coins;
