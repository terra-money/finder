import React, { FC } from "react";
import c from "classnames";

interface Props {
  wrapperClassName?: string;
  className?: string;
}

const Table: FC<Props> = ({ wrapperClassName, className, children }) => (
  <div className={c("table-responsive", wrapperClassName)}>
    <table className={c("table", className)}>{children}</table>
  </div>
);

export default Table;
