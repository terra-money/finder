import React from "react";
import routes from "../routes";
import s from "./App.module.scss";
import Header from "./Header";
import { withRouter } from "react-router-dom";
import NetworkContext from "../contexts/NetworkContext";
import useNetwork from "../hooks/useNetwork";
import ErrorBoundary from "../components/ErrorBoundary";

const App = () => {
  return (
    <section className={s.main}>
      <NetworkContext.Provider value={useNetwork()}>
        <Header />
        <section className={s.content}>
          <ErrorBoundary>{routes}</ErrorBoundary>
        </section>
      </NetworkContext.Provider>
    </section>
  );
};

export default withRouter(App);
