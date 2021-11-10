import { useEffect, useState } from "react";
import c from "classnames";
import { intervalToDuration } from "date-fns";
import { useCurrentChain } from "../../contexts/ChainsContext";
import s from "./Searching.module.scss";

const Searching = ({ state, hash }: { state: number; hash: string }) => {
  const progressState = (state / 1) * 100;
  const isSearch = progressState < 100;
  const searching = "#2043b5";
  const failed = "#ff5561";
  const { chainID } = useCurrentChain();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setNow(new Date());
  }, [chainID, hash]);

  const { minutes, seconds } = intervalToDuration({
    start: new Date(),
    end: now
  });

  const fromNow = [minutes, seconds]
    .map(str => String(str).padStart(2, "0"))
    .join(":");

  return (
    <section className={s.wrapper}>
      <span className={s.progressTitle}>
        {isSearch ? "Searching transaction" : "Transaction not found"}
      </span>
      <div
        className={
          isSearch
            ? c(s.progress, s.progressStriped, s.active)
            : c(s.progress, s.active)
        }
      >
        <div
          className={s.progressBar}
          style={{
            width: `${isSearch ? progressState : "100"}%`,
            backgroundColor: `${isSearch ? searching : failed}`
          }}
        />
      </div>
      <span
        className={s.timer}
        style={{ color: `${isSearch ? searching : failed}` }}
      >
        {fromNow}
      </span>
      <span className={s.text}>
        {isSearch
          ? "Please wait while looking for transaction"
          : "No such transaction was found"}
      </span>
    </section>
  );
};

export default Searching;
