import React from "react";
import s from "./PaginationButtons.module.scss";
import { Link } from "react-router-dom";

type Props = {
  current: number;
  total: number;
  links?: { [key: string]: { pathname: string; search: string } };
  actions?: { [key: string]: () => void };
  useStartEnd?: boolean;
};

const PaginationButtons = ({ current, total, actions, useStartEnd }: Props) => {
  const renderAction = (key: string, children: string, disabled: boolean) =>
    disabled ? (
      <span className={s[key]}>{children}</span>
    ) : (
      <button onClick={actions && actions[key]} className={s[key]}>
        {children}
      </button>
    );

  return total ? (
    <div className={s.wrapper}>
      <div className={s.component}>
        {useStartEnd && renderAction("start", "«", current === 1)}
        {renderAction("prev", "‹", current === 1)}
        {useStartEnd && (
          <span className={s.text}>{`${current} of ${total}`}</span>
        )}
        {renderAction("next", "›", current === total)}
        {useStartEnd && renderAction("end", "»", current === total)}
      </div>
    </div>
  ) : null;
};

export default PaginationButtons;
