import { Coin } from "@terra-money/terra.js";
import { useRecoilValue } from "recoil";
import { useDenoms } from "../../components/SelectCurrency";
import { useFCDURL } from "../../contexts/ChainsContext";
import useRequest from "../../hooks/useRequest";
import { DEFAULT_CURRENCY } from "../../scripts/utility";
import { Currency } from "../../store/CurrencyStore";
import Available from "./Available";

const AvailableList = ({ list }: { list: Coin[] }) => {
  const currency = useRecoilValue(Currency);
  const denoms = useDenoms();
  const denom = denoms?.includes(currency) ? currency : DEFAULT_CURRENCY;
  const fcdURL = useFCDURL();
  const { data, isLoading } = useRequest<CurrencyData[]>({
    url: `${fcdURL}/v1/market/swaprate/${denom}`
  });

  const props = { data, isLoading, currency };
  return (
    <>
      {list.map((coin, i) => {
        const { denom, amount } = coin;
        return (
          <Available
            denom={denom}
            amount={amount.toString()}
            key={i}
            response={props}
          />
        );
      })}
    </>
  );
};

export default AvailableList;
