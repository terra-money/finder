import React from "react";

import s from "./SelectNetworks.module.scss";
import networksConfig from "../config/networks";
import NetworkContext from "../contexts/NetworkContext";

type Props = {
  className?: string;
};
const SelectNetworks = (props: Props) => {
  return (
    <NetworkContext.Consumer>
      {({ network, setNetwork }) => (
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
      )}
    </NetworkContext.Consumer>
  );
};

export default SelectNetworks;
