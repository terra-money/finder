import { get, isObject } from "lodash";
import TxAmount from "./TxAmount";

const TxTax = ({ log }: { log: Log }) => {
  const result: { [key: string]: number } = {};

  if (!isObject(log) || !log) {
    return <>0 Luna</>;
  }

  try {
    const tax = get(log, "log.tax");

    if (typeof tax !== "string" || tax.length === 0) {
      return <>0 Luna</>;
    }

    tax.split(",").forEach(tax => {
      const { amount, denom } = getAmountAndDenom(tax);

      if (denom && amount) {
        result[denom] = amount + (result[denom] || 0);
      }
    });
  } catch (err) {
    // ignore JSON.parse error
  }

  const keys = Object.keys(result);

  if (!keys.length) {
    return <>0 Luna</>;
  }

  return (
    <>
      {keys.map((denom, key) => (
        <TxAmount
          index={key}
          amount={result[denom].toString()}
          denom={denom}
          key={key}
        />
      ))}
    </>
  );
};

export default TxTax;

const getAmountAndDenom = (tax: string) => {
  const result = /-?\d*\.?\d+/g.exec(tax);

  if (!result) {
    return {
      amount: 0,
      denom: ""
    };
  }

  return {
    amount: +result[0],
    denom: tax.slice(result[0].length)
  };
};
