import { format } from "date-fns-tz";
import distanceInWordsToNow from "date-fns/formatDistanceToNow";
import isBase64 from "is-base64";
import { Dictionary } from "ramda";
import { countries, Country } from "countries-list";
import networksConfig from "../config/networks";
import { isInteger } from "./math";
import { filter } from "lodash";

export const DEFAULT_NETWORK = networksConfig[0].key || "columbus-4";
export const DEFAULT_CURRENCY = `uusd`;
export const DEFAULT_FCD = `https://fcd.terra.dev`;
export const DEFAULT_MANTLE = "https://mantle.terra.dev";
export const BASE_DENOM = `uluna`;

export function getEndpointByKeyword(keyword: string, network: string) {
  if (isInteger(keyword)) {
    return `/${network}/blocks/${keyword}`;
  } else if (keyword.indexOf("terravaloper") === 0) {
    return `/${network}/validator/${keyword}`;
  } else if (keyword.indexOf("terra") === 0) {
    return `/${network}/address/${keyword}`;
  } else {
    return `/${network}/tx/${keyword}`;
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

export function fcdUrl(key: string) {
  return networksConfig.find(n => n.key === key)?.fcd || DEFAULT_FCD;
}

export function mantleUri(key: string) {
  return networksConfig.find(n => n.key === key)?.mantle || DEFAULT_MANTLE;
}

export function isTerraAddress(keyword: string) {
  if (keyword && keyword.length === 44 && keyword.indexOf("terra") > -1) {
    return true;
  }
  return false;
}

export function isValidatorAddress(keyword: string) {
  if (
    keyword &&
    keyword.length === 51 &&
    keyword.indexOf("terravaloper") > -1
  ) {
    return true;
  }
  return false;
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

export function transformChainId(chainId: string) {
  //for Terra assets
  const chain = chainId.split("-")[0];
  return chain === "columbus" ? "mainnet" : "testnet";
}
