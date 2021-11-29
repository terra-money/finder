import React, { useState } from "react";
import c from "classnames/bind";
import { LogFinderActionResult } from "@terra-money/log-finder-ruleset";
import CoinComponent from "../components/Coin";
import {
  isTerraAddress,
  isValidatorAddress,
  sliceMsgType
} from "../scripts/utility";
import format from "../scripts/format";
import Action from "../pages/Tx/Action";
import Address from "./Address";
import WasmMsg from "./WasmMsg";
import Icon from "./Icon";
import s from "./Msg.module.scss";

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
    return <WasmMsg msg={msg.value[key]} />;
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

interface Props {
  msg: Msg;
  log?: Log;
  info?: LogFinderActionResult[];
}

const cx = c.bind(s);

export const MsgBox = ({ msg, log, info }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const msgType = sliceMsgType(msg.type);
  const eventLogs = log?.events && renderEventlog(log.events);

  return (
    <div className={s.msgBox}>
      <div className={cx(s.type, { show: isOpen })}>
        <div className={s.action}>
          {info?.map(msg =>
            msg.transformed?.canonicalMsg.map((str, key) => (
              <Action action={str} key={key} />
            ))
          )}
        </div>
      </div>

      <div className={s.details}>
        <span className={s.msgType}>{msgType}</span>
        <hr />
        {Object.keys(msg.value).map((key: string, index: number) => {
          if (key === "wasm_byte_code") {
            //ignore wasm_byte_code in MsgStoreCode
            return <></>;
          } else {
            const content = getContent(msg, key);
            return (
              <section className={s.msgWrapper} key={index}>
                <span className={s.key}>{key}</span>
                {content}
              </section>
            );
          }
        })}
        {isOpen && eventLogs}
        {eventLogs && (
          <button className={s.button} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "Hide Logs" : "Show Logs"}
            <Icon name={isOpen ? "expand_less" : "expand_more"} size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MsgBox;
