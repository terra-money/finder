import React, { useContext } from "react";
import { Link } from "react-router-dom";
import c from "classnames";
import NetworkContext from "../contexts/NetworkContext";

type Props = {
  q: string;
  v?: string;
  children: string;
  className?: string;
  brand?: boolean;
  network?: string;
};

const Finder = ({ q, v, children, className, brand, network }: Props) => {
  const { network: contextNetwork } = useContext(NetworkContext);

  return (
    <Link
      to={`/${network || contextNetwork}/${q}/${v || children}`}
      className={c(className, brand && "text-primary")}
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
};

export default Finder;
