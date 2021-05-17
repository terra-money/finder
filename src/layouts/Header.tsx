import React from "react";
import s from "./Header.module.scss";
import Search from "../components/Search";
import SelectNetworks from "../components/SelectNetworks";

import { Link } from "react-router-dom";
import SelectCurrency from "../components/SelectCurrency";

const Header = () => (
  <div className={s.header}>
    <div className={s.inner}>
      <div className={s.logo}>
        <Link to="/">
          <img
            src="https://s3.ap-northeast-2.amazonaws.com/terra.money.home/static/finder/logo.svg"
            alt=""
          />
        </Link>
      </div>
      <Search className={s.search} />
      <SelectNetworks className={s.networks} />
      <SelectCurrency className={s.currency} />
    </div>
  </div>
);

export default Header;
