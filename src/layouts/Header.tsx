import React from "react";
import s from "./Header.module.scss";
import Search from "../components/Search";

import { Link } from "react-router-dom";
import logo from "../images/logo.svg";
import SelectOptions from "../components/SelectOptions";

const Header = () => (
  <div className={s.header}>
    <div className={s.inner}>
      <div className={s.logo}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <Search className={s.search} />
      <SelectOptions />
    </div>
  </div>
);

export default Header;
