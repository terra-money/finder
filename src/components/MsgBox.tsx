import React from "react";
import CoinComponent from "../components/Coin";
import {
  sliceMsgType,
  isTerraAddress,
  isValidatorAddress
} from "../scripts/utility";
import format from "../scripts/format";
import { decodeBase64 } from "../scripts/utility";
import Finder from "./Finder";
import Formatter from "./Formatter";
import s from "./Msg.module.scss";

export default ({ msg, log }: { msg: Msg; log: Log | undefined }) => {
  const getContent = (key: string) => {
    if (isTerraAddress(msg.value[key])) {
      return (
        <Finder q="account" v={msg.value[key]}>
          {msg.value[key]}
        </Finder>
      );
    } else if (isValidatorAddress(msg.value[key])) {
      return (
        <Finder q="validator" v={msg.value[key]}>
          {msg.value[key]}
        </Finder>
      );
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
      return decodeBase64(msg.value[key]);
    } else {
      return Array.isArray(msg.value[key])
        ? msg.value[key].map((j: any, index: number) => (
            <p key={index}>{`${JSON.stringify(j, undefined, 2)}`}</p>
          ))
        : JSON.stringify(msg.value[key]);
    }
  };

  const renderEventlog = () =>
    log && (
      <div className={s.eventWrapper}>
        <span>event logs</span>
        {log.events.map((value, key) => (
          <section key={key}>
            <h2 className={s.eventType}>{`[${key}] ${value.type}`}</h2>
            <hr />
            <table className={s.events}>
              <tbody>
                {value.attributes.map((attr, key) => {
                  const formatExact = [
                    "exchange_rates",
                    "exchange_rate"
                  ].includes(attr.key);

                  return (
                    <tr key={key} className={s.eventData}>
                      <th className={s.attrKey}>{attr.key}</th>
                      <td className={s.attrValue}>
                        {attr.value && (
                          <Formatter
                            value={attr.value}
                            formatExact={formatExact}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    );

  return (
    <div className={s.msgBox}>
      <div className={s.type}>{sliceMsgType(msg.type)}</div>

      {Object.keys(msg.value).map((key: string, index: number) => {
        const content = getContent(key);
        return (
          <p key={index}>
            <span>{key}</span>

            {content}
          </p>
        );
      })}
      {renderEventlog()}
    </div>
  );
};
