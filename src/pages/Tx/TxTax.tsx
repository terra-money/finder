import TxAmount from "./TxAmount";

const TxTax = ({ tax }: { tax: string }) => {
  const { amount, denom } = getAmountAndDenom(tax);

  return <TxAmount amount={amount.toString()} denom={denom} />;
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
