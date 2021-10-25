import format from "../../scripts/format";
import useDenomTrace from "../../hooks/useDenomTrace";
import AmountCard from "./AmountCard";

type Props = {
  denom: string;
  available: string;
};

const IBCUnit = ({ denom, available }: Props) => {
  const hash = denom.replace("ibc/", "");
  const data = useDenomTrace(denom);

  if (!data) {
    return <>{format.truncate(hash, [6, 6])}</>;
  }

  const { base_denom, path } = data;

  return (
    <AmountCard
      amount={available}
      hash={hash}
      path={path}
      denom={format.denom(base_denom)}
    />
  );
};

export default IBCUnit;
