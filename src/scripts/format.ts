import BigNumber from "bignumber.js";
import { format as formatTZ } from "date-fns-tz";

const formatDecimal = (number: BigNumber.Value): string =>
  new BigNumber(number).decimalPlaces(6, BigNumber.ROUND_DOWN).toFixed(6);

const formatAmount = (amount: BigNumber.Value): string =>
  new BigNumber(amount)
    .div(1e6)
    .decimalPlaces(6, BigNumber.ROUND_DOWN)
    .toFormat(6);

const formatDenom = (denom: string): string => {
  if (!denom) {
    return "";
  }

  if (denom[0] === "u") {
    const f = denom.slice(1);

    if (f.length > 3) {
      return f === "luna" ? "Luna" : f.toUpperCase();
    }

    return f.slice(0, 2).toUpperCase() + "T";
  }

  return denom;
};

const formatCoin = ({ amount, denom }: CoinData): string =>
  [formatAmount(amount), formatDenom(denom)].join(" ");

const format = {
  decimal: formatDecimal,
  amount: formatAmount,
  denom: formatDenom,
  coin: formatCoin,
  coins: (coins: CoinData[]): string[] => coins.map(formatCoin),

  date: (param: string): string => {
    const str = formatTZ(new Date(param), "yyyy.MM.dd HH:mm:ssXXX");
    return str;
  },

  truncate: (address: string = "", [h, t]: number[]) => {
    const head = address.slice(0, h);
    const tail = address.slice(-1 * t, address.length);
    return !address
      ? ""
      : address.length > h + t
      ? [head, tail].join("…")
      : address;
  }
};

export default format;
