import React, { useState, useEffect } from "react";

import s from "./SelectNetworks.module.scss";
import networksConfig from "../config/networks";
import { setLocalStorageNetwork, DEFAULT_NETWORK } from "../scripts/utility";

type Props = {
  className?: string;
};
const SelectNetworks = (props: Props) => {
  const pathArray = window.location.pathname.split("/");

  const [network, setNetwork] = useState(pathArray[1] || DEFAULT_NETWORK); // default network

  useEffect(() => {
    setLocalStorageNetwork(network);
  }, [network]);

  return (
    <div className={props.className}>
      <select
        className={s.select}
        value={network}
        onChange={e => setNetwork(e.target.value)}
      >
        {networksConfig.map(({ key }, index) => {
          return <option key={index}>{key}</option>;
        })}
      </select>
      <div className={s.addon}>
        <i className="material-icons">arrow_drop_down</i>
      </div>
    </div>
  );
};

export default SelectNetworks;
