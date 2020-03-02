import React from "react";
import s from "./Msg.module.scss";
import Coin from "../components/Coin";
import {
  sliceMsgType,
  isTerraAddress,
  isValidatorAddress
} from "../scripts/utility";
import format from "../scripts/format";
import Finder from "./Finder";
import { isArray } from "lodash";

export default ({ msg }: { msg: Msg }) => {
  return (
    <div className={s.msgBox}>
      <div className={s.type}>{sliceMsgType(msg.type)}</div>

      {Object.keys(msg.value).map((key: string, index: number) => {
        if (isTerraAddress(msg.value[key])) {
          return (
            <p key={index}>
              <span>{key}</span>
              <Finder q="account" v={msg.value[key]}>
                {msg.value[key]}
              </Finder>
            </p>
          );
        } else if (isValidatorAddress(msg.value[key])) {
          return (
            <p key={index}>
              <span>{key}</span>
              <Finder q="validator" v={msg.value[key]}>
                {msg.value[key]}
              </Finder>
            </p>
          );
        } else if (key === "amount" || key === "offer_coin") {
          return (
            <p key={index}>
              <span>{key}</span>
              <span>
                {Array.isArray(msg.value[key]) ? (
                  msg.value[key].map((a: Coin) => <Coin key={a.denom} {...a} />)
                ) : (
                  <Coin {...msg.value[key]} />
                )}
              </span>
            </p>
          );
        } else if (key === "ask_denom" || key === "denom") {
          return (
            <p key={index}>
              <span>{key}</span>
              <span>{format.denom(msg.value[key])}</span>
            </p>
          );
        } else {
          return (
            <div key={index}>
              <span>{key}</span>
              {isArray(msg.value[key]) ? (
                <div>
                  {msg.value[key].map((j: any, index: number) => (
                    <p key={index}>{`${JSON.stringify(j, undefined, 2)}`}</p>
                  ))}
                </div>
              ) : (
                <span>{JSON.stringify(msg.value[key])}</span>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};
