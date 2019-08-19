import React from "react";
import { Link } from "react-router-dom";
import { getNetwork } from "../scripts/utility";
import c from "classnames";

type Props = {
  q: string;
  v?: string;
  children: string;
  className?: string;
  brand?: boolean;
  caret?: boolean;
};

const Finder = ({ q, v, children, className, brand, caret }: Props) => {
  return (
    <Link
      to={`/${getNetwork()}/${q}/${v || children}`}
      className={c(className, brand && "text-primary")}
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
};

export default Finder;
