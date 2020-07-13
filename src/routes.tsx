import React from "react";
import { Route, Switch } from "react-router-dom";
import Index from "./pages/Index/Index";
import Block from "./pages/Block";
import Tx from "./pages/Tx";
import Account from "./pages/Account";
import Txs from "./pages/Txs";
import Validator from "./pages/Validator";
import NotFound from "./components/NotFound";

export default (
  <Switch>
    <Route path="/" exact component={Index} />
    <Route path="/:network" exact component={Index} />
    <Route path="/:network/blocks/:height" component={Block} />
    <Route path="/:network/txs/:height" component={Txs} />
    <Route path="/:network/tx/:hash" component={Tx} />
    <Route path="/:network/account/:address" component={Account} />
    <Route path="/:network/validator/:address" component={Validator} />
    <Route path="*" component={NotFound} />
  </Switch>
);
