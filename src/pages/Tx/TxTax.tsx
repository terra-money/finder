import TxAmount from "./TxAmount";

const TxTax = ({ tax }: { tax: string[] }) => (
  <>
    {tax.map((coins, index) =>
      coins.split(",").map((coin: string, key: number) => {
        const { amount, denom } = getAmountAndDenom(coin);
        return (
          <TxAmount
            index={index}
            amount={amount.toString()}
            denom={denom}
            key={key}
          />
        );
      })
    )}
  </>
);
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
