import React, { ReactNode } from "react";
import c from "classnames";

type Props = {
  active?: boolean;
  small?: boolean;
  className?: string;
  children: ReactNode;
};

const Badge = ({ active, small, children, className }: Props) => (
  <span
    className={c(
      "badge",
      active && "badge-primary",
      small && "badge-small",
      className
    )}
  >
    {children}
  </span>
);

export default Badge;
