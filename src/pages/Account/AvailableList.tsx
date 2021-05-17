import { useContext } from "react";
import CurrencyContext from "../../contexts/CurrencyContext";
import { useRequest } from "../../HOCs/WithFetch";
import { DEFAULT_CURRENCY } from "../../scripts/utility";
import Available from "./Available";

const AvailableList = ({ list }: { list: Balance[] }) => {
  const { currency } = useContext(CurrencyContext);

  const denomResponse: ActiveDenom = useRequest({
    url: `/oracle/denoms/actives`
  });

  const denom = denomResponse.data?.result?.includes(currency)
    ? currency
    : DEFAULT_CURRENCY;

  const response = useRequest({
    url: `/v1/market/swaprate/${denom}`
  });

  return (
    <>
      {list.map((a, i) => (
        <Available
          {...a}
          key={i}
          currency={{ response: response, currency: denom }}
        />
      ))}
    </>
  );
};

export default AvailableList;
