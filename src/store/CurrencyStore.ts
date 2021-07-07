import { atom } from "recoil";
import { DEFAULT_CURRENCY } from "../scripts/utility";

export const Currency = atom<string>({
  key: "CurrencyState",
  default: DEFAULT_CURRENCY
});
