import React from "react";
import CoinComponent from "../components/Coin";
import {
  sliceMsgType,
  isTerraAddress,
  isValidatorAddress
} from "../scripts/utility";
import format from "../scripts/format";
import { decodeBase64 } from "../scripts/utility";
import s from "./Msg.module.scss";
import Address from "./Address";

const prettifyExecuteMsg = (str: string) => {
  const decoded = JSON.parse(decodeBase64(str));

  try {
    const parsed = decoded;

    if (typeof parsed === "object") {
      Object.keys(parsed).forEach(key => {
        parsed[key].msg = JSON.parse(decodeBase64(parsed[key].msg));
      });
    }

    return JSON.stringify(parsed, undefined, 2);
  } catch (e) {
    return JSON.stringify(decoded, undefined, 2);
  }
};

const getContent = (msg: Msg, key: string) => {
  if (isTerraAddress(msg.value[key]) || isValidatorAddress(msg.value[key])) {
    return <Address address={msg.value[key]} />;
  } else if (key === "amount" || key === "offer_coin") {
    return Array.isArray(msg.value[key]) ? (
      msg.value[key].map((a: CoinData) => (
        <CoinComponent key={a.denom} {...a} />
      ))
    ) : (
      <CoinComponent {...msg.value[key]} />
    );
  } else if (key === "ask_denom" || key === "denom") {
    return format.denom(msg.value[key]);
  } else if (key === "execute_msg") {
    return <pre>{prettifyExecuteMsg(msg.value[key])}</pre>;
  } else {
    return Array.isArray(msg.value[key])
      ? msg.value[key].map((j: any, index: number) => (
          <p key={index}>{`${JSON.stringify(j, undefined, 2)}`}</p>
        ))
      : JSON.stringify(msg.value[key]);
  }
};

const renderAddress = (str: string) =>
  isTerraAddress(str) || isValidatorAddress(str) ? (
    <Address address={str} />
  ) : (
    str
  );

const renderEventlog = (events: Events[]) => (
  <div className={s.msgWrapper}>
    <span className={s.key}>event logs</span>
    {events.map((value, key) => (
      <section key={key}>
        <h2 className={s.eventType}>{`[${key}] ${value.type}`}</h2>
        <hr />
        <table className={s.events}>
          <tbody>
            {value.attributes.map((attr, key) => (
              <tr key={key} className={s.eventData}>
                <th className={s.attrKey}>{attr.key}</th>
                <td className={s.attrValue}>
                  {attr.value && renderAddress(attr.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    ))}
  </div>
);

export const MsgBox = ({ msg, log }: { msg: Msg; log?: Log }) => (
  <div className={s.msgBox}>
    <div className={s.type}>{sliceMsgType(msg.type)}</div>
    {Object.keys(msg.value).map((key: string, index: number) => {
      const content = getContent(msg, key);
      return (
        <section className={s.msgWrapper} key={index}>
          <span className={s.key}>{key}</span>
          {content}
        </section>
      );
    })}
    {log?.events && renderEventlog(log.events)}
  </div>
);

export default MsgBox;
