import React from "react";
import { Link } from "react-router-dom";
import c from "classnames";
import { useCurrentChain } from "../contexts/ChainsContext";

type Props = {
  q: string;
  v?: string;
  children: string;
  className?: string;
  brand?: boolean;
  network?: string;
};

const Finder = ({ q, v, children, className, brand, network }: Props) => {
  const { name } = useCurrentChain();

  return (
    <Link
      to={`/${name}/${q}/${v || children}`}
      className={c(className, brand && "text-primary")}
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
};

export default Finder;
