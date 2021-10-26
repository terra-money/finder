import { AccAddress } from "@terra-money/terra.js";
import { isNativeDenom, readAmount, readDenom } from "terra-utils";
import { formatDenom, splitTokenText } from "./helpers/utility";
import { DEFAULT_DECIMALS } from "./helpers/constants";
import useTokenContractQuery from "./helpers/useTokenContractQuery";
import useDenomTrace from "../../hooks/useDenomTrace";
import TokenAddress from "./TokenAddress";
import FinderLink from "./FinderLink";

const Coin = ({ children: coin }: { children: string }) => {
  const { amount, token } = splitTokenText(coin);
  const { data: tokenInfo } = useTokenContractQuery(token);
  const data = useDenomTrace(coin.replace(amount, ""));

  const unit = AccAddress.validate(token) ? (
    <FinderLink address={token}>
      <TokenAddress>{token}</TokenAddress>
    </FinderLink>
  ) : isNativeDenom(token) ? (
    readDenom(token)
  ) : data ? (
    <>{formatDenom(data.base_denom)}</>
  ) : (
    <>{token}</>
  );

  const decimals = tokenInfo?.decimals || DEFAULT_DECIMALS;

  return (
    <strong>
      {readAmount(amount, { decimals })} {unit}
    </strong>
  );
};

export default Coin;
