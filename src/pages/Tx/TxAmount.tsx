import useDenomTrace from "../../hooks/useDenomTrace";
import format from "../../scripts/format";

interface Props {
  amount: string;
  denom: string;
  index?: number;
  isFormatAmount?: boolean;
}

const TxAmount = ({ index, amount, denom, isFormatAmount }: Props) => {
  const { data: ibcToken } = useDenomTrace(denom);

  if (!amount || !denom) {
    return <>0 Luna</>;
  }

  const renderAmount = isFormatAmount ? amount : format.amount(amount);
  if (ibcToken) {
    const { base_denom } = ibcToken;

    return (
      <>
        {renderAmount} {format.denom(base_denom)}
      </>
    );
  }

  return (
    <>
      {!!index && ", "}
      {renderAmount} {format.denom(denom)}
    </>
  );
};
export default TxAmount;
