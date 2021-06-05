import isBase64 from "is-base64";
import { decodeBase64 } from "../scripts/utility";

// is-base64 takes terra1 address as base64 as well; prevent this.
const isBase64Extended = (value: string) =>
  typeof value === "string" &&
  // case: terra1... address is bech32 and it naturally is base64-eligible.
  !value.startsWith("terra1") &&
  // case: we are only interested in json-alike base64's, which generally start with "ey" ('{')
  value.startsWith("ey") &&
  // other checks
  isBase64(value);

const reviver = (_: string, value: any) =>
  isBase64Extended(value) ? JSON.parse(decodeBase64(value), reviver) : value;

const prettifyWasmMsg = (str: string | object) => {
  if (typeof str === "string" && isBase64Extended(str)) {
    const decoded = decodeBase64(str);
    try {
      return JSON.stringify(JSON.parse(decoded.toString(), reviver), null, 2);
    } catch (_) {
      return decoded;
    }
  }
  return JSON.stringify(str, undefined, 2);
};

type Prop = {
  msg: string | object;
};

const WasmMsg = (prop: Prop) => <pre>{prettifyWasmMsg(prop.msg)}</pre>;

export default WasmMsg;
