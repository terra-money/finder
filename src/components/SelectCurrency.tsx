import { useEffect } from "react";
import { useRecoilState } from "recoil";
import useRequest from "../hooks/useRequest";
import { getCookie } from "../scripts/cookie";
import { DEFAULT_CURRENCY, getDefaultCurrency } from "../scripts/utility";
import { Currency } from "../store/CurrencyStore";
import s from "./SelectCurrency.module.scss";

type Props = {
  className?: string;
};

const SelectCurrency = (props: Props) => {
  const [currency, setCurrency] = useRecoilState(Currency);
  const denoms = useDenoms();
  const denom = denoms?.includes(currency) ? currency : DEFAULT_CURRENCY;

  useEffect(() => {
    if (!getCookie("currency") && navigator.cookieEnabled) {
      const currency = getDefaultCurrency(denoms ?? []);
      setCurrency(currency);
    }
  }, [setCurrency, denoms]);

  return (
    <div className={props.className}>
      <select
        className={s.select}
        value={denom.substr(1).toUpperCase()}
        onChange={e => setCurrency(`u${e.target.value}`.toLowerCase())}
      >
        {denoms?.map((currency, key) => {
          const activeDenom = currency.substr(1).toUpperCase();
          return <option key={key}>{activeDenom}</option>;
        })}
      </select>
      <div className={s.addon}>
        <i className="material-icons">arrow_drop_down</i>
      </div>
    </div>
  );
};

export default SelectCurrency;

export const useDenoms = () => {
  const { data: response }: ActiveDenom = useRequest({
    url: `/oracle/denoms/actives`
  });

  return response?.result;
};
