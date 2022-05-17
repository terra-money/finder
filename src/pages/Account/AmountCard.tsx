import React, { ReactNode } from "react";
import BigNumber from "bignumber.js";
import { find, map } from "lodash";
import { lte } from "../../scripts/math";
import format from "../../scripts/format";
import { ASSET_URL } from "../../scripts/utility";
import Image from "../../components/Image";
import Card from "../../components/Card";
import Amount from "../../components/Amount";
import s from "./AmountCard.module.scss";

type Props = {
  denom: string;
  amount: string;
  path?: string;
  hash?: string;
  icon?: string;
  button?: ReactNode;
  children?: ReactNode;
  response?: Currency;
  decimals?: number;
};

const AmountCard = (props: Props) => {
  const {
    denom,
    icon,
    amount,
    path,
    hash,
    button,
    children,
    response,
    decimals
  } = props;
  const iconLink = `${ASSET_URL}/icon/60/${denom}.png`;

  const iconRender = (
    <div className={s.icon}>
      <Image url={icon || iconLink} size={30} />
    </div>
  );

  return (
    <Card bodyClassName={s.card}>
      <article className={s.article}>
        <header className={s.header}>
          <div className={s.token_wrapper}>
            {iconRender}
            <h1 className={s.denom}>{denom}</h1>
            {hash && path && (
              <span className={s.meta}>
                {format.truncate(hash, [6, 6])} ({path})
              </span>
            )}
          </div>
          <section className={s.action}>
            <Amount className={s.amount} decimals={decimals}>
              {lte(amount, 0) ? "0" : amount}
            </Amount>
            <span className={s.currency}>
              {response && renderCurreny(denom, amount, response)}
            </span>
            <div className={s.button}>{button}</div>
          </section>
        </header>

        {children}
      </article>
    </Card>
  );
};

export default AmountCard;

const renderCurreny = (denom: string, amount: string, response: Currency) => {
  const { data, currency } = response;
  const denoms = map(data, "denom").map(str => format.denom(str));

  if (!denoms.includes(denom) || !data) return "";

  const renderData = find(data, obj => denom === format.denom(obj.denom));
  const result =
    renderData && new BigNumber(amount).dividedBy(renderData.swaprate);

  return (
    result && `= ${format.amount(result)} ${currency.substr(1).toUpperCase()}`
  );
};
