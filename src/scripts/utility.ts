import { format } from "date-fns-tz";
import distanceInWordsToNow from "date-fns/formatDistanceToNow";
import isBase64 from "is-base64";
import { Dictionary } from "ramda";
import { countries, Country } from "countries-list";
import { filter } from "lodash";
import { Coin, Coins } from "@terra-money/terra.js";
import { isDenomIBC } from "@terra.kitchen/utils";
import { isInteger } from "./math";
import { isTnsName } from "../libs/tns";

export const DEFAULT_CURRENCY = `uusd`;
export const BASE_DENOM = `uluna`;
export const ASSET_URL = "https://assets.terra.money";
export const TERRA_ADDRESS_REGEX = /(terra[0-9][a-z0-9]{38})/g;
export const LOCALTERRA_FCD_URL = "http://localhost:3060";

export function getEndpointByKeyword(keyword: string) {
  const key = keyword.toLowerCase();

  if (isInteger(key)) {
    return `/blocks/${key}`;
  } else if (isTnsName(key)) {
    return `/address/${key}`;
  } else if (key.indexOf("terravaloper") === 0) {
    return `/validator/${key}`;
  } else if (key.indexOf("terra") === 0) {
    return `/address/${key}`;
  } else if (key.length === 64) {
    return `/tx/${key}`;
  } else {
    return `/notfound/${keyword}`;
  }
}

export function fromISOTime(time: string) {
  return format(new Date(time), `yyyy.MM.dd HH:mm:ssXXX`);
}

export function fromNow(time: string) {
  return distanceInWordsToNow(new Date(time));
}

export function sliceMsgType(msg: string) {
  if (!msg || typeof msg === "object") return "unknown msg";
  const msgResult = String(msg);
  const slashIndex = msgResult.indexOf("/");
  return slashIndex > -1 ? msgResult.slice(slashIndex + 1) : msgResult;
}

export function prependProtocol(url: string) {
  if (url.indexOf("http") > -1) {
    return url;
  } else {
    return `http://` + url;
  }
}

export function decodeBase64(str: string) {
  try {
    if (isBase64(str)) {
      return Buffer.from(str, "base64").toString();
    }

    return str;
  } catch {
    return str;
  }
}

export function isJson(param: any) {
  try {
    JSON.parse(param);
    return true;
  } catch {
    return false;
  }
}

export function getDefaultCurrency(denoms: string[]) {
  if (!navigator.language) {
    return DEFAULT_CURRENCY;
  }

  const browserLang = navigator.language;
  const countryData = countries as Dictionary<Country>;

  if (browserLang.includes("-")) {
    const country = browserLang.split("-")?.[1]?.toUpperCase();
    const currencies = countryData[country]?.currency.split(",");

    if (currencies) {
      // we might have multiple currencies
      for (const currency of currencies) {
        const denom = `u${currency.toLowerCase()}`;

        if (denoms.includes(denom)) {
          return denom;
        }
      }
    }
  }

  const countryArray = Object.values(countryData);
  const country = filter(countryArray, { languages: [browserLang] });

  if (country) {
    for (const data of country) {
      const denom = `u${data.currency.toLowerCase()}`;

      if (denoms.includes(denom)) {
        return denom;
      }
    }
  }

  return DEFAULT_CURRENCY;
}

export const splitCoinData = (coin: string) => {
  try {
    const coinData = Coin.fromString(coin);
    const amount = coinData.amount.toString();
    const denom = coinData.denom;
    return { amount, denom };
  } catch {
    const denom = coin.match(TERRA_ADDRESS_REGEX)?.[0];
    const amount = coin.replace(TERRA_ADDRESS_REGEX, "");
    if (denom && amount) {
      return { amount, denom };
    }
  }
};

export const isIbcDenom = (string = "") => string.startsWith("ibc/");

export const sortCoins = (
  coins: Coins,
  currency?: string,
  sorter?: (a: CoinData, b: CoinData) => number
) => {
  return sortByDenom(coins.toData(), currency, sorter);
};
export const sortByDenom = <T extends { denom: string }>(
  coins: T[],
  currency = "",
  sorter?: (a: T, b: T) => number
) =>
  coins.sort(
    (a, b) =>
      compareIs("uluna")(a.denom, b.denom) ||
      compareIs("uusd")(a.denom, b.denom) ||
      compareIs(currency)(a.denom, b.denom) ||
      compareIsDenomIBC(a.denom, b.denom) ||
      (sorter?.(a, b) ?? 0)
  );

export const compareIs = (k: string) => (a: string, b: string) =>
  Number(b === k) - Number(a === k);

export const compareIsDenomIBC = (a: string, b: string) =>
  Number(isDenomIBC(a)) - Number(isDenomIBC(b));

export const getTaxData = (tax: string | undefined) => {
  if (tax) {
    const taxData = splitCoinData(tax);
    return taxData;
  } else {
    return "";
  }
};
