import { useRecoilValue } from "recoil";
import { useRequest } from "../../HOCs/WithFetch";
import { DEFAULT_CURRENCY } from "../../scripts/utility";
import { Currency } from "../../store/CurrencyStore";
import { Denoms } from "../../store/DenomStore";
import Available from "./Available";

const AvailableList = ({ list }: { list: Balance[] }) => {
  const currency = useRecoilValue(Currency);
  const denoms = useRecoilValue(Denoms);
  const denom = denoms.includes(currency) ? currency : DEFAULT_CURRENCY;

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
