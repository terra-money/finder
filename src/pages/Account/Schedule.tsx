import { CircularProgress } from "@material-ui/core";
import { format } from "date-fns";
import c from "classnames/bind";
import { percent } from "../../scripts/math";
import Amount from "../../components/Amount";
import Icon from "../../components/Icon";
import s from "./Schedule.module.scss";

const cx = c.bind(s);

interface Props extends Schedule {
  index: number;
  isPeriodicVestingAccount?: boolean;
}

const Schedule = ({ index, isPeriodicVestingAccount, ...schedule }: Props) => {
  const { amount, startTime, endTime, ratio } = schedule;

  if (!amount) {
    return null;
  }

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

  const state = text[String(status)];

  return (
    <article className={s.component}>
      {isPeriodicVestingAccount ? (
        <section className={s.status}>
          <section className={s.dot}>
            <div className={s.circle}>{index + 1}</div>
          </section>

          <section className={s.percent}>{percent(ratio)}</section>
        </section>
      ) : null}

      <header className={s.header}>
        <div
          className={cx(s.status, s.releaseInfo, {
            marginBottom: isPeriodicVestingAccount
          })}
        >
          {state === "Released" ? (
            <Icon name="check_circle" size={13} className={s.icon} />
          ) : state === "Releasing" ? (
            <CircularProgress
              size={10}
              thickness={5}
              color="inherit"
              className={s.progress}
            />
          ) : null}
          <span>
            <span className={cx({ releasing: state === "Releasing" }, s.state)}>
              {state}
            </span>{" "}
            <strong>
              {[startTime, endTime]
                .filter(Boolean)
                .map(t => (t ? `${toISO(new Date(Number(t)))}` : null))
                .join("\n ~ ")}
            </strong>
          </span>
        </div>
        {isPeriodicVestingAccount ? (
          <span className={s.amount}>
            <Amount fontSize={18}>{amount}</Amount>
          </span>
        ) : null}
      </header>
    </article>
  );
};

export default Schedule;

/* helpers */
const toISO = (date: Date) => format(date, "MMM dd, yyyy");
