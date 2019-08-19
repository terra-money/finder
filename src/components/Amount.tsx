import React from "react";
import c from "classnames";
import format from "../scripts/format";
import s from "./Amount.module.scss";

type Props = {
  estimated?: boolean;
  fontSize?: number;
  className?: string;
  denom?: string;
  children?: string;
};

const Amount = (props: Props) => {
  const { estimated, fontSize, className, denom, children } = props;
  const [integer, decimal] = format.amount(children || "0").split(".");
  return (
    <span className={c(s.component, className)} style={{ fontSize }}>
      {estimated && "≈ "}
      {integer}
      <small>
        .{decimal}
        {denom && ` ${format.denom(denom)}`}
      </small>
    </span>
  );
};

export default Amount;
