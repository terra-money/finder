import React from "react";
import { Route, Switch } from "react-router-dom";
import Index from "./pages/Index/Index";
import Block from "./pages/Block";
import Tx from "./pages/Tx";
import Address from "./pages/Account/Address";
import Contract from "./pages/Account/Contract";
import Validator from "./pages/Validator";
import NotFound from "./components/NotFound";

export default (
  <Switch>
    <Route path="/" exact component={Index} />
    <Route path="/:network" exact component={Index} />
    <Route path="/:network/blocks/:height" component={Block} />
    <Route path="/:network/txs/:height" component={Block} />
    <Route path="/:network/tx/:hash" component={Tx} />
    <Route path="/:network/validator/:address" component={Validator} />
    <Route path="/:network/address/:address" component={Address} />
    <Route path="/:network/account/:address" component={Address} />
    <Route path="/:network/contract/:address" component={Contract} />
    <Route path="*" component={NotFound} />
  </Switch>
);
