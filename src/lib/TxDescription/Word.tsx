import React from "react";
import { isNativeDenom, readDenom } from "terra-utils";

interface Props {
  children: string;
  bold: boolean;
}

const Word = ({ children: word, bold }: Props) => {
  const content = isNativeDenom(word) ? readDenom(word) : word;
  return bold ? <strong>{content}</strong> : <span>{content}</span>;
};

export default Word;
