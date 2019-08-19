import React, { ReactNode } from "react";

const Table = ({ children }: { children: ReactNode }) => (
  <div className="table-responsive">
    <table className="table">{children}</table>
  </div>
);

export default Table;
