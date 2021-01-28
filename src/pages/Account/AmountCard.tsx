import React, { ReactNode, useState } from "react";
import { lte } from "../../scripts/math";
import Card from "../../components/Card";
import Amount from "../../components/Amount";
import { ReactComponent as Terra } from "../../images/Terra.svg";
import s from "./AmountCard.module.scss";

type Props = {
  denom: string;
  amount: string;
  icon?: string;
  button?: ReactNode;
  children?: ReactNode;
};

const AmountCard = ({ denom, icon, amount, button, children }: Props) => {
  const size = { width: 30, height: 30 };
  const iconLink = `https://assets.terra.money/icon/60/${denom}.png`;
  const [iconError, setIconError] = useState(false);

  const iconRender = (
    <div className={s.icon}>
      {icon ? (
        <img src={icon} alt={denom} {...size} />
      ) : !iconError ? (
        <img
          src={iconLink}
          onError={() => setIconError(true)}
          alt={denom}
          {...size}
        />
      ) : (
        <Terra {...size} />
      )}
    </div>
  );

  return (
    <Card bodyClassName={s.card}>
      <article className={s.article}>
        <header className={s.header}>
          <div className={s.token_wrapper}>
            {iconRender}
            <h1 className={s.denom}>{denom}</h1>
          </div>
          <section className={s.action}>
            <Amount className={s.amount}>
              {lte(amount, 0) ? "0" : amount}
            </Amount>
            <div className={s.button}>{button}</div>
          </section>
        </header>

        {children}
      </article>
    </Card>
  );
};

export default AmountCard;
