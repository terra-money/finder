import React from "react";
import routes from "../routes";
import s from "./App.module.scss";
import Header from "./Header";
import ErrorBoundary from "../components/ErrorBoundary";

const App = () => {
  return (
    <section className={s.main}>
      <Header />
      <section className={s.content}>
        <ErrorBoundary>{routes}</ErrorBoundary>
      </section>
    </section>
  );
};

export default App;
