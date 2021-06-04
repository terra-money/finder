import isBase64 from "is-base64";
import { decodeBase64 } from "../scripts/utility";

const prettifyWasmMsg = (str: string | object) => {
  if (typeof str === "string" && isBase64(str)) {
    const decoded = decodeBase64(str);
    try {
      const parsed = JSON.parse(decoded);
      if (typeof parsed === "object") {
        Object.keys(parsed).forEach(key => {
          parsed[key].msg = JSON.parse(decodeBase64(parsed[key].msg));
        });
      }
      return JSON.stringify(parsed, undefined, 2);
    } catch (e) {
      return JSON.stringify(decoded, undefined, 2);
    }
  }
  return JSON.stringify(str, undefined, 2);
};

type Prop = {
  msg: string | object;
};

const WasmMsg = (prop: Prop) => <pre>{prettifyWasmMsg(prop.msg)}</pre>;

export default WasmMsg;
