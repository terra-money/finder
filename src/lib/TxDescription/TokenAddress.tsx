import React from "react";
import { truncate } from "terra-utils";
import useTokenContractQuery from "./helpers/useTokenContractQuery";

const TokenAddress = ({ children: address }: { children: string }) => {
  const { data: tokenInfo } = useTokenContractQuery(address);
  return <>{tokenInfo?.symbol ?? truncate(address)}</>;
};

export default TokenAddress;
