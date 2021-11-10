import React from "react";
import { useChains, useCurrentChain } from "../contexts/ChainsContext";

import s from "./SelectNetworks.module.scss";

type Props = {
  className?: string;
};
const SelectNetworks = (props: Props) => {
  const chains = useChains();
  const currentChain = useCurrentChain();

  return (
    <div className={props.className}>
      <select
        className={s.select}
        value={currentChain.name}
        onChange={e =>
          console.log(e.target.value)
        } /* TODO: 주소를 바꿔줘야 함 */
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
