import { useIsClassic } from "../../contexts/ChainsContext";
import format from "../../scripts/format";
import { getTaxData } from "../../scripts/utility";
import { get } from "lodash";

interface Props {
  logs: Log[] | undefined
}

const TaxRateAmount = ({ logs }: Props) => {
  const isClassic = useIsClassic();

  if(!isClassic){
    return <></>;
  }

  const tax = get(logs, "[0].log.tax") || get(logs, "[1].log.tax") || "",
    { denom, amount } = getTaxData(tax) || {};

  if (!denom || !amount) {
    return <>-</>;
  }

  return (
    <>
      {format.amount(amount)} {format.denom(denom, isClassic)}
    </>
  );
};

export default TaxRateAmount;