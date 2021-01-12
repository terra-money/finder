import React from "react";
import s from "./NoDataYet.module.scss";

type Props = {
  context: string;
};
const NoDataYet = (props: Props) => {
  const { context } = props;
  return <div className={s.container}>No {context} yet</div>;
};

export default NoDataYet;
