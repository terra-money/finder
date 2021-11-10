import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChains, useCurrentChain } from "../contexts/ChainsContext";

import s from "./SelectNetworks.module.scss";

type Props = {
  className?: string;
};
const SelectNetworks = (props: Props) => {
  const chains = useChains();
  const currentChain = useCurrentChain();
  const params = useParams();
  const navigate = useNavigate();

  const changeChain = (value = "") => {
    const prev = params["*"];
    const isIndex = !prev;
    const name = isIndex && value === "mainnet" ? "" : "/" + value;
    navigate(`${name}/${params["*"]}`);
  };

  return (
    <div className={props.className}>
      <select
        className={s.select}
        value={currentChain.name}
        onChange={e => changeChain(e.target.value)}
      >
        {chains.map(({ name }) => (
          <option key={name}>{name}</option>
        ))}
      </select>
      <div className={s.addon}>
        <i className="material-icons">arrow_drop_down</i>
      </div>
    </div>
  );
};

export default SelectNetworks;
