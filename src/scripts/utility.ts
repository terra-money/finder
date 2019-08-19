import { formatToTimeZone } from "date-fns-timezone";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import networksConfig from "../config/networks";
import { isInteger } from "./math";
import { isEmpty } from "lodash";

export const DEFAULT_NETWORK = `columbus-2`;
export const DEFAULT_FCD = `https://fcd.terra.dev`;
export const BASE_DENOM = `uluna`;

export function handleSearch(keyword: string, network: string) {
  if (isInteger(keyword)) {
    return `/${network}/blocks/${keyword}`;
  } else if (keyword.indexOf("terravaloper") > -1) {
    return `/${network}/validator/${keyword}`;
  } else if (keyword.indexOf("terra") > -1) {
    return `/${network}/account/${keyword}`;
  } else {
    return `/${network}/tx/${keyword}`;
  }
}

export function fromISOTime(time: string) {
  return formatToTimeZone(time, `YYYY.MM.DD HH:mm:ss`, { timeZone: "Etc/UTC" });
}

export function fromNow(time: string) {
  return distanceInWordsToNow(time);
}

export function sliceMsgType(msg: string) {
  if (!msg || typeof msg === "object") return "unknown msg";
  const msgResult = String(msg);
  const slashIndex = msgResult.indexOf("/");
  return slashIndex > -1 ? msgResult.slice(slashIndex + 1) : msgResult;
}

export function fcdUrl(key: string) {
  return isEmpty(networksConfig.filter(n => n.key === key))
    ? DEFAULT_FCD
    : networksConfig.filter(n => n.key === key)[0].fcd;
}

export function getNetwork() {
  return localStorage.getItem("network") || DEFAULT_NETWORK;
}

export function setLocalStorageNetwork(network: string) {
  const keys = networksConfig.map(n => n.key);

  const key = keys.indexOf(network) > -1 ? network : DEFAULT_NETWORK;

  localStorage.setItem("network", key);
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
