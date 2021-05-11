import { useContext } from "react";
import { useRequest } from "../HOCs/WithFetch";
import CurrencyContext from "../contexts/CurrencyContext";
import s from "./SelectCurrency.module.scss";

type Props = {
  className?: string;
};

type ResponseDenom = {
  data?: {
    result: string[];
  };
  isLoading: boolean;
};

const SelectCurrency = (props: Props) => {
  const { currency, selectCurrency } = useContext(CurrencyContext);
  const response: ResponseDenom = useRequest({ url: `/oracle/denoms/actives` });
  const currencyArray = response.data?.result.filter(str => str !== "uluna");

  return (
    <div className={props.className}>
      <select
        className={s.select}
        value={currency.substr(1).toUpperCase()}
        onChange={e => selectCurrency(`u${e.target.value}`.toLowerCase())}
      >
        {currencyArray?.map((currency, key) => {
          const denom = currency.substr(1).toUpperCase();
          return <option key={key}>{denom}</option>;
        })}
      </select>
      <div className={s.addon}>
        <i className="material-icons">arrow_drop_down</i>
      </div>
    </div>
  );
};

export default SelectCurrency;
