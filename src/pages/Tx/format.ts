import { Coin } from "@terra-money/terra.js";
import BigNumber from "bignumber.js";
import format from "../../scripts/format";
import { isFinite } from "../../scripts/math";

//1.020 -> 1.02
const NumberFormatRegExp = /\.?0+$/g;

export const transformAssets = (str: string): string => {
  if (isFinite(new BigNumber(str))) {
    return format.amount(str).replace(NumberFormatRegExp, "");
  }

  const array = str.split(",").filter(str => str !== "");

  if (array.length >= 1) {
    let value: string = "";

    array.forEach((coin, key) => {
      const token = formatCoin(coin);
      value += key === array.length - 1 ? token : `${token}, `;
    });

    return value;
  } else {
    return formatCoin(str);
  }
};

const formatCoin = (str: string): string => {
  try {
    const coinData = Coin.fromString(str);
    return `${format
      .amount(coinData.amount.toString())
      .replace(NumberFormatRegExp, "")} ${format.denom(coinData.denom)}`;
  } catch {
    return str;
  }
};
