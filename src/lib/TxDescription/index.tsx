/* eslint-disable no-nested-ternary */
import React, { Fragment } from "react";
import { AccAddress, ValAddress } from "@terra-money/terra.js";
import { ComponentProps } from "./helpers/types";
import { isCoins } from "./helpers/utility";
import { PropsProvider } from "./helpers/NetworkProvider";
import ValidatorAddress from "./ValidatorAddress";
import TerraAddress from "./TerraAddress";
import Coins from "./Coins";
import Word from "./Word";

interface Props extends ComponentProps {
  children: string;
}

const TxDescription = ({ children: sentence, network, config }: Props) => {
  const renderWord = (word: string, index: number) =>
    ValAddress.validate(word) ? (
      <ValidatorAddress>{word}</ValidatorAddress>
    ) : AccAddress.validate(word) ? (
      <TerraAddress>{word}</TerraAddress>
    ) : isCoins(word) ? (
      <Coins>{word}</Coins>
    ) : (
      <Word bold={!index}>{word}</Word>
    );

  return (
    <PropsProvider value={{ network, config }}>
      {sentence.split(" ").map((word, i) => (
        <Fragment key={`fg-${i.toString()}`}>
          {!!i && " "}
          {renderWord(word, i)}
        </Fragment>
      ))}
    </PropsProvider>
  );
};

export { TxDescription };
