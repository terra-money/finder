import { useIsClassic } from "../../contexts/ChainsContext";
import { getTaxData } from "../../scripts/utility";
import { get } from "lodash";
import Amount from "../../components/Amount";

interface Props {
  logs: Log[] | undefined;
}

const TaxRateAmount = ({ logs }: Props) => {
  const isClassic = useIsClassic();

  if (!isClassic) {
    return <></>;
  }

  const tax = get(logs, "[0].log.tax") || get(logs, "[1].log.tax") || "",
    { denom, amount } = getTaxData(tax) || {};

  if (!denom || !amount) {
    return <>-</>;
  }

  return <Amount denom={denom}>{amount}</Amount>;
};

export default TaxRateAmount;
