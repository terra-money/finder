import "react-app-polyfill/ie9";
import "core-js";
import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import {
  BrowserRouter as Router,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import "./index.scss";
import App from "./layouts/App";
import NetworkContext from "./contexts/NetworkContext";
import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";
import { DEFAULT_NETWORK } from "./scripts/utility";

if (
  process.env.REACT_APP_SENTRY_DSN &&
  /^http/.test(process.env.REACT_APP_SENTRY_DSN)
) {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

const Root = () => {
  const { push } = useHistory();
  const location = useLocation();
  const network = location.pathname.split("/")[1] || DEFAULT_NETWORK;
  const selectNetwork = (network: string) => {
    const pathnames = location.pathname.split("/");
    pathnames[1] = network;
    push(pathnames.join("/"));
  };

  return (
    <RecoilRoot>
      <NetworkContext.Provider value={{ network, selectNetwork }}>
        <Switch>
          <App />
        </Switch>
      </NetworkContext.Provider>
    </RecoilRoot>
  );
};

ReactDOM.render(
  <Router>
    <Root />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
