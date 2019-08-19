import React from "react";
import routes from "../routes";
import s from "./App.module.scss";
import Header from "./Header";
import { withRouter } from "react-router-dom";
import NetworkContext from "../contexts/NetworkContext";
import useNetwork from "../hooks/useNetwork";

const App = () => {
  return (
    <section className={s.main}>
      <NetworkContext.Provider value={useNetwork()}>
        <Header />
        <section className={s.content}>{routes}</section>
      </NetworkContext.Provider>
    </section>
  );
};

export default withRouter(App);
