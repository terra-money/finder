import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";
import { CircularProgress } from "@material-ui/core";
import classNames from "classnames";
import Icon from "../../components/Icon";
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
        <small className={styles.timestamp}>{fromNow}</small>
      </header>

      <section className={styles.processing}>
        <div className={classNames(styles.item, styles.text)}>
          <h2>Queued</h2>
        </div>

        <div className={classNames(styles.item, styles.icons)}>
          <Icon name="chevron_right" className={styles.icon} />
          <Icon name="chevron_right" className={styles.icon} />
          <Icon name="chevron_right" className={styles.icon} />
        </div>

        <div className={classNames(styles.item, styles.text, styles.muted)}>
          <h2>Processed</h2>
        </div>
      </section>

      <p className={styles.desc}>
        The transaction has been successfully queued and will be processed
        shortly.
      </p>
    </article>
  );
};

export default Pending;
