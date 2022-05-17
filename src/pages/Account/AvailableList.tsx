import { useRecoilValue } from "recoil";
import { useDenoms } from "../../components/SelectCurrency";
import useRequest from "../../hooks/useRequest";
import { DEFAULT_CURRENCY } from "../../scripts/utility";
import { Currency } from "../../store/CurrencyStore";
import Available from "./Available";

const AvailableList = ({ list }: { list: Balance[] }) => {
  const currency = useRecoilValue(Currency);
  const denoms = useDenoms();
  const denom = denoms?.includes(currency) ? currency : DEFAULT_CURRENCY;

  const { data, isLoading } = useRequest<CurrencyData[]>({
    url: `/v1/market/swaprate/${denom}`
  });

  const props = { data, isLoading, currency };
  return (
    <>
      {list.map((a, i) => (
        <Available {...a} key={i} response={props} />
      ))}
    </>
  );
};

export default AvailableList;
