import "react-app-polyfill/ie9";
import "core-js";
import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { getChainOptions } from "@terra-money/wallet-provider";
import "./index.scss";
import App from "./layouts/App";
import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";
import { ChainsOptionsProvider } from "./contexts/ChainsContext";

if (
  process.env.REACT_APP_SENTRY_DSN &&
  /^http/.test(process.env.REACT_APP_SENTRY_DSN)
) {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false }
  }
});

const Root = () => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <App />
        </Switch>
      </QueryClientProvider>
    </RecoilRoot>
  );
};

getChainOptions().then(chainOptions => {
  ReactDOM.render(
    <ChainsOptionsProvider value={chainOptions}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ChainsOptionsProvider>,
    document.getElementById("root")
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
