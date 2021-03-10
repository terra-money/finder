import React from "react";
import s from "./PaginationButtons.module.scss";
import { Link } from "react-router-dom";

type Props = {
  current: number;
  total: number;
  links?: { [key: string]: { pathname: string; search: string } };
  actions?: { [key: string]: () => void };
};

const PaginationButtons = ({ current, total, actions, links }: Props) => {
  const renderAction = (key: string, children: string, disabled: boolean) =>
    disabled ? (
      <span className={s[key]}>{children}</span>
    ) : links ? (
      <Link to={links[key]} className={s[key]}>
        {children}
      </Link>
    ) : (
      <button onClick={actions && actions[key]} className={s[key]}>
        {children}
      </button>
    );

  return total ? (
    <div className={s.wrapper}>
      <div className={s.component}>
        {renderAction("prev", "‹", current === 1)}
        {renderAction("next", "›", current === total)}
      </div>
    </div>
  ) : null;
};

export default PaginationButtons;
