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
import { QueryClient, QueryClientProvider } from "react-query";
import { map } from "lodash";
import "./index.scss";
import App from "./layouts/App";
import NetworkContext from "./contexts/NetworkContext";
import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";
import { DEFAULT_NETWORK } from "./scripts/utility";
import networks from "./config/networks";

if (
  process.env.REACT_APP_SENTRY_DSN &&
  /^http/.test(process.env.REACT_APP_SENTRY_DSN)
) {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

const queryClient = new QueryClient();

const Root = () => {
  const { push } = useHistory();
  const location = useLocation();
  const chains = map(networks, "key").filter(id => id !== undefined);
  const chainId = location.pathname.split("/")[1];
  const network = chains.includes(chainId) ? chainId : DEFAULT_NETWORK;

  const selectNetwork = (network: string) => {
    const pathnames = location.pathname.split("/");

    if (chains.includes(pathnames[1])) {
      pathnames[1] = network;
      push(pathnames.join("/"));
    } else {
      pathnames[1] = `${network}/${pathnames[1]}`;
      push(pathnames.join("/"));
    }
  };

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <NetworkContext.Provider value={{ network, selectNetwork }}>
          <Switch>
            <App />
          </Switch>
        </NetworkContext.Provider>
      </QueryClientProvider>
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
