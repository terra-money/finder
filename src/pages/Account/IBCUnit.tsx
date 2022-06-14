import { useIBCWhitelist } from "../../hooks/useTerraAssets";
import AmountCard from "./AmountCard";

type Props = {
  denom: string;
  available: string;
};

const IBCUnit = ({ denom = "", available }: Props) => {
  const hash = denom.replace("ibc/", "");
  const data = useIBCWhitelist();
  const tokenInfo = data?.[hash];

  return tokenInfo ? (
    <AmountCard
      amount={available}
      hash={hash}
      path={tokenInfo.path}
      icon={tokenInfo.icon}
      denom={tokenInfo.symbol}
      decimals={tokenInfo.decimals}
    />
  ) : null;
};

export default IBCUnit;
