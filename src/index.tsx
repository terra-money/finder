import "react-app-polyfill/ie9";
import "core-js";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./index.scss";
import Index from "./pages/Index/Index";
import App from "./layouts/App";
import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";

Sentry.init({
  dsn: "https://837ad343b375465da7604dd7209cc2b3@sentry.io/1523799"
});

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" exact component={Index} />
      <App />
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
