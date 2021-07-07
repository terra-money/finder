import { useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { getCookie } from "../scripts/cookie";
import { DEFAULT_CURRENCY, getDefaultCurrency } from "../scripts/utility";
import { Currency } from "../store/CurrencyStore";
import { Denoms } from "../store/DenomStore";
import s from "./SelectCurrency.module.scss";

type Props = {
  className?: string;
};

const SelectCurrency = (props: Props) => {
  const [currency, setCurrency] = useRecoilState(Currency);
  const denoms = useRecoilValue(Denoms);
  const denom = denoms.includes(currency) ? currency : DEFAULT_CURRENCY;

  useEffect(() => {
    if (!getCookie("currency") && navigator.cookieEnabled) {
      const currency = getDefaultCurrency(denoms);
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
        {denoms.map((currency, key) => {
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
