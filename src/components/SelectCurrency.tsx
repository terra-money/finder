import { useContext, useEffect } from "react";
import { useRequest } from "../HOCs/WithFetch";
import CurrencyContext from "../contexts/CurrencyContext";
import s from "./SelectCurrency.module.scss";
import { getCookie } from "../scripts/cookie";
import { DEFAULT_CURRENCY, getDefaultCurrency } from "../scripts/utility";

type Props = {
  className?: string;
};

const SelectCurrency = (props: Props) => {
  const { currency, selectCurrency } = useContext(CurrencyContext);
  const response: ActiveDenom = useRequest({ url: `/oracle/denoms/actives` });
  const currencyArray = response.data?.result.filter(str => str !== "uluna");

  const denom = currencyArray?.includes(currency) ? currency : DEFAULT_CURRENCY;

  useEffect(() => {
    if (!getCookie("currency") && currencyArray && navigator.cookieEnabled) {
      const currency = getDefaultCurrency(currencyArray);
      selectCurrency(currency);
    }
  }, [selectCurrency, currencyArray]);

  return (
    <div className={props.className}>
      <select
        className={s.select}
        value={denom.substr(1).toUpperCase()}
        onChange={e => selectCurrency(`u${e.target.value}`.toLowerCase())}
      >
        {currencyArray?.map((currency, key) => {
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
