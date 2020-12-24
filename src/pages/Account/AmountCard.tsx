import React, { ReactNode } from "react";
import { Dictionary } from "ramda";
import { lte } from "../../scripts/math";
import Card from "../../components/Card";
import Amount from "../../components/Amount";
import { ReactComponent as Luna } from "../../images/Luna.svg";
import { ReactComponent as Terra } from "../../images/Terra.svg";
import SDT from "../../images/SDT.png";
import UST from "../../images/UST.png";
import KRT from "../../images/KRT.png";
import MNT from "../../images/MNT.png";
import s from "./AmountCard.module.scss";

type Props = {
  denom: string;
  amount: string;
  icon?: string;
  button?: ReactNode;
  children?: ReactNode;
};

const TerraIcon: Dictionary<string> = { SDT, UST, KRT, MNT };

const AmountCard = ({ denom, icon, amount, button, children }: Props) => {
  const size = { width: 30, height: 30 };

  const iconRender = icon ? (
    <div className={s.icon}>
      <img src={icon} alt={denom} {...size} />
    </div>
  ) : TerraIcon[denom] ? (
    <div className={s.icon}>
      <img src={TerraIcon[denom]} alt={denom} {...size} />
    </div>
  ) : denom === "Luna" ? (
    <Luna {...size} className={s.icon} />
  ) : (
    <Terra {...size} className={s.icon} />
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
