import { useEffect, useState } from "react";
import { truncate } from "terra-utils";
import useTokenContractQuery from "./helpers/useTokenContractQuery";

const TokenAddress = ({ children: address }: { children: string }) => {
  const { data: tokenInfo } = useTokenContractQuery(address);
  const [symbol, setSymbol] = useState<string>();

  useEffect(() => {
    tokenInfo && setSymbol(tokenInfo.symbol);
  }, [tokenInfo]);

  return <>{symbol ?? truncate(address)}</>;
};

export default TokenAddress;
