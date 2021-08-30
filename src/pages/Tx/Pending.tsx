import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";
import { CircularProgress } from "@material-ui/core";
import classNames from "classnames";
import { ReactComponent as Icon } from "../../images/Queued.svg";
import styles from "./Pending.module.scss";

const Pending = ({ timestamp }: { timestamp: string }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setInterval(() => setNow(new Date()), 1000);
  }, []);

  const { minutes, seconds } = intervalToDuration({
    start: new Date(timestamp),
    end: now
  });

  const fromNow = [minutes, seconds]
    .map(str => String(str).padStart(2, "0"))
    .join(":");

  return (
    <article className={styles.component}>
      <CircularProgress size={60} thickness={2} />

      <header className={styles.header}>
        <h1 className={styles.title}>Broadcasting transaction</h1>
      </header>

      <section className={styles.processing}>
        <div className={styles.item}>
          <h2>Queued</h2>
        </div>

        <div className={classNames(styles.item, styles.icons)}>
          <Icon className={styles.icon} />
        </div>
      </section>
      <p className={styles.timestamp}>{fromNow}</p>

      <p className={styles.desc}>This transaction is in process.</p>
    </article>
  );
};

export default Pending;
