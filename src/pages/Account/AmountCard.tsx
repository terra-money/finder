import React, { ReactNode } from "react";
import { lte } from "../../scripts/math";
import Card from "../../components/Card";
import Amount from "../../components/Amount";
import s from "./AmountCard.module.scss";

type Props = {
  denom: string;
  amount: string;
  icon?: string;
  button?: ReactNode;
  children?: ReactNode;
};

const AmountCard = ({ denom, icon, amount, button, children }: Props) => (
  <Card bodyClassName={s.card}>
    <article className={s.article}>
      <header className={s.header}>
        <div className={s.token_wrapper}>
          {icon && (
            <div className={s.icon}>
              <img src={icon} alt={denom} width="18" height="18"></img>
            </div>
          )}
          <h1 className={s.denom}>{denom}</h1>
        </div>
        <section className={s.action}>
          <Amount className={s.amount}>{lte(amount, 0) ? "0" : amount}</Amount>
          <div className={s.button}>{button}</div>
        </section>
      </header>

      {children}
    </article>
  </Card>
);

export default AmountCard;
