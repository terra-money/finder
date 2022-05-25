import { Coin } from "@terra-money/terra.js";
import { useRecoilValue } from "recoil";
import { useFCDURL, useIsClassic } from "../../contexts/ChainsContext";
import useRequest from "../../hooks/useRequest";
import { useDenoms } from "../../queries/oracle";
import { DEFAULT_CURRENCY } from "../../scripts/utility";
import { Currency } from "../../store/CurrencyStore";
import Available from "./Available";

const AvailableList = ({ list }: { list: Coin[] }) => {
  const currency = useRecoilValue(Currency);
  const { data: denoms } = useDenoms();
  const denom = denoms?.includes(currency) ? currency : DEFAULT_CURRENCY;
  const fcdURL = useFCDURL();
  const isClassic = useIsClassic();
  const { data, isLoading } = useRequest<CurrencyData[]>({
    url: `${fcdURL}/v1/market/swaprate/${denom}`,
    enabled: isClassic
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
