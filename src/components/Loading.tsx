import React from "react";
import s from "./Loading.module.scss";

const Loading = () => {
  return (
    <div className={s[`loader-wrapper`]}>
      <div className={s[`loader`]}>
        <div className={s[`a`]}></div>
        <div className={s[`b`]}></div>
      </div>
    </div>
  );
};

export default Loading;
