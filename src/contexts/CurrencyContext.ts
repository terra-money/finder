import React from "react";
import { DEFAULT_CURRENCY } from "../scripts/utility";

const CurrencyContext = React.createContext({
  currency: DEFAULT_CURRENCY,
  selectCurrency: (currency: string) => {}
});

export default CurrencyContext;
