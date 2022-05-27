import React from "react";
import c from "classnames";
import { percent } from "../../scripts/math";
import format from "../../scripts/format";
import Amount from "../../components/Amount";
import Icon from "../../components/Icon";
import s from "./Schedule.module.scss";

interface Props extends Schedule {
  denom: string;
  totalReleased?: string;
}

const Schedule = ({ denom, totalReleased, ...schedule }: Props) => {
  const { amount, startTime, endTime, ratio, freedRate, delayed, released } =
    schedule;
  const width = percent(freedRate ?? 0);
  const now = new Date().getTime();
  const status =
    Number(endTime) < now
      ? -1
      : !startTime
      ? 1
      : Number(startTime) < now
      ? 0
      : 1;

  const text: { [key: string]: string } = {
    "-1": "Released",
    "0": "Releasing",
    "1": "Release on"
  };

  return (
    <article className={s.component}>
      <section className={s.status}>
        <section className={s.dot}>
          <div className={s.circle}>
            {status === -1 && <Icon name="check" size={13} />}
          </div>
        </section>

        {!delayed ? (
          <section className={s.percent}>{percent(ratio)}</section>
        ) : null}
      </section>

      <header className={s.header}>
        <h1>
          <Amount denom={denom} fontSize={20}>
            {amount}
          </Amount>
        </h1>

        <p>
          <strong>{text[String(status)]}</strong>
          {released && text[String(status)] === "Releasing" ? (
            <strong>
              {" "}
              (Released: <Amount denom={denom}>{String(released)}</Amount>)
            </strong>
          ) : null}
          <br />
          {[startTime, endTime]
            .map(t => (t ? `${toISO(Number(t))}` : null))
            .join("\n ~ ")}
        </p>
        {!delayed ? (
          <div className={s.track}>
            <div
              className={c(s.progress, status === 0 && s.active)}
              style={{ width }}
              title={width}
            />
          </div>
        ) : null}
      </header>
    </article>
  );
};

export default Schedule;

/* helpers */
const toISO = (date: number) => format.date(new Date(date).toISOString());
