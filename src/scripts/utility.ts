import { format } from "date-fns-tz";
import distanceInWordsToNow from "date-fns/formatDistanceToNow";
import isBase64 from "is-base64";
import { Dictionary } from "ramda";
import networksConfig from "../config/networks";
import currencies from "../currencies.json";
import { getCookie, setCookie } from "./cookie";
import { isInteger } from "./math";

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

export function getDefaultCurrency() {
  const cookie = getCookie("currency");
  if (cookie) return cookie;

  const currency = currencies as Dictionary<string>;

  if (currency[navigator.language]) {
    setCookie("currency", currency[navigator.language]);
    return currency[navigator.language];
  } else return DEFAULT_CURRENCY;
}
