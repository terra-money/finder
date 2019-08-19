import React, { ReactNode } from "react";
import s from "./FlexTable.module.scss";
import c from "classnames";

type Props = {
  head: ReactNode[];
  body: ReactNode[][];
  tableStyle?: object;
  headStyle?: object;
};
const FlexTable = ({ head, body, headStyle, tableStyle }: Props) => {
  const renderHeader = (item: ReactNode, index: number) => (
    <th className={s.cell} key={index}>
      {item}
    </th>
  );
  const renderCell = (item: ReactNode, index: number) => (
    <td className={s.cell} key={index}>
      {item}
    </td>
  );

  return (
    <table className={c(s.table)} style={{ ...tableStyle }}>
      <thead>
        <tr className={s.head} style={{ ...headStyle }}>
          {head.map(renderHeader)}
        </tr>
      </thead>

      <tbody className={s.body}>
        {body.map((row, index) => (
          <tr key={index}>{row.map(renderCell)}</tr>
        ))}
      </tbody>
    </table>
  );
};

export default FlexTable;
