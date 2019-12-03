import React, { Component } from "react";

import routes from "../routes";
import s from "./App.module.scss";
import Header from "./Header";
import ErrorBoundary from "../components/ErrorBoundary";

import NetworkContext from "../contexts/NetworkContext";

class App extends Component {
  setNetwork = (network: string) => {
    this.setState({
      network: network
    });
  };
  state = {
    network: window.location.pathname.split("/")[1],
    setNetwork: this.setNetwork
  };

  render() {
    return (
      <section className={s.main}>
        <NetworkContext.Provider value={this.state}>
          <Header />
          <section className={s.content}>
            <ErrorBoundary>{routes}</ErrorBoundary>
          </section>
        </NetworkContext.Provider>
      </section>
    );
  }
}

export default App;
