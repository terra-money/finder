import React from "react";
import s from "./NoDataYet.module.scss";

type Props = {
  context: string;
};
export default (props: Props) => {
  const { context } = props;
  return <div className={s.container}>No {context} yet</div>;
};
