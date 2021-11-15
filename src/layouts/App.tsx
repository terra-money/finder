import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { Dictionary } from "ramda";
import {
  createActionRuleSet,
  createAmountRuleSet
} from "@terra-money/log-finder-ruleset";
import routes from "../routes";
import ErrorBoundary from "../components/ErrorBoundary";
import { useCurrentChain } from "../contexts/ChainsContext";
import { useRequest } from "../HOCs/WithFetch";
import { Denoms } from "../store/DenomStore";
import {
  LogfinderActionRuleSet,
  LogfinderAmountRuleSet
} from "../store/LogfinderRuleSetStore";
import { Whitelist } from "../store/WhitelistStore";
import { Contracts } from "../store/ContractStore";
import useTerraAssets from "../hooks/useTerraAssets";
import Header from "./Header";
import s from "./App.module.scss";

type TokenList = Dictionary<Whitelist>;
type ContractList = Dictionary<Contracts>;

const App = () => {
  const { name, chainID } = useCurrentChain();

  const { data: whitelist } =
    useTerraAssets<Dictionary<TokenList>>("cw20/tokens.json");
  const { data: contracts } = useTerraAssets<Dictionary<ContractList>>(
    "cw20/contracts.json"
  );

  const response: ActiveDenom = useRequest({ url: `/oracle/denoms/actives` });

  const setWhitelist = useSetRecoilState(Whitelist);
  const setContracts = useSetRecoilState(Contracts);
  const setActionRules = useSetRecoilState(LogfinderActionRuleSet);
  const setAmountRules = useSetRecoilState(LogfinderAmountRuleSet);
  const setDenoms = useSetRecoilState(Denoms);

  useEffect(() => {
    const actionRules = createActionRuleSet(name);
    const amountRules = createAmountRuleSet();
    setActionRules(actionRules);
    setAmountRules(amountRules);

    if (whitelist && contracts && response.data?.result) {
      setWhitelist(whitelist[name]);
      setContracts(contracts[name]);
      setDenoms(response.data.result);
    }
  }, [
    response,
    name,
    whitelist,
    contracts,
    setDenoms,
    setActionRules,
    setAmountRules,
    setWhitelist,
    setContracts
  ]);

  return (
    <section className={s.main} key={chainID}>
      <Header />
      <section className={s.content}>
        <ErrorBoundary>{routes}</ErrorBoundary>
      </section>
    </section>
  );
};

export default App;
