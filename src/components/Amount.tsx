import { Dictionary } from "ramda";
import { Tokens } from "../hooks/cw20/useTokenBalance";
import { useContracts, useWhitelist } from "../hooks/useTerraAssets";
import { isTerraAddress } from "../scripts/utility";
import format from "../scripts/format";
import useDenomTrace from "../hooks/useDenomTrace";
import { useIsClassic } from "../contexts/ChainsContext";

type Props = {
  estimated?: boolean;
  fontSize?: number;
  className?: string;
  denom?: string;
  children?: string;
  decimals?: number;
};

type Contract = Dictionary<Contracts>;

const renderDenom = (
  str: string,
  whitelist?: Tokens,
  contracts?: Contract,
  isClassic?: boolean
) => {
  const list = whitelist?.[str];
  const contract = contracts?.[str];
  if (isTerraAddress(str) && (list || contract)) {
    return list?.symbol ? list?.symbol : contract?.name;
  } else if (format.denom(str).length >= 40) {
    return "Token";
  } else {
    return format.denom(str, isClassic);
  }
};

const Amount = (props: Props) => {
  const { estimated, fontSize, className, denom, children, decimals } = props;
  const whitelist = useWhitelist();
  const contracts = useContracts();
  const isClassic = useIsClassic();

  const tokenDecimals = denom ? whitelist?.[denom]?.decimals : decimals;

  const [integer, decimal] = format
    .amount(children || "0", tokenDecimals ?? decimals)
    .split(".");

  const data = useDenomTrace(denom);

  return (
    <span className={className} style={{ fontSize }}>
      {estimated && "≈ "}
      {integer}
      <small>
        .{decimal}
        {data
          ? ` ${format.denom(data.base_denom, isClassic)}`
          : denom && ` ${renderDenom(denom, whitelist, contracts, isClassic)}`}
      </small>
    </span>
  );
};

export default Amount;
