import React, { useState, useContext } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { getEndpointByKeyword } from "../scripts/utility";
import s from "./Search.module.scss";
import networkContext from "../contexts/NetworkContext";

type Props = {
  className?: string;
} & RouteComponentProps;

const Search = ({ className, history }: Props) => {
  const [value, setValue] = useState(``);
  const { network } = useContext(networkContext);

  const handleSubmit: Submit = async e => {
    e.preventDefault();

    if (value) {
      history.push(getEndpointByKeyword(value.trim(), network));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className={s.group}>
        <input
          type="search"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={"Search Block / Tx / Account"}
          autoFocus
        />
        <button className={s.button} type="submit">
          <i className="material-icons">search</i>
        </button>
      </div>
    </form>
  );
};

export default withRouter(Search);
