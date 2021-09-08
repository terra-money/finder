import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { Dictionary } from "ramda";
import routes from "../routes";
import ErrorBoundary from "../components/ErrorBoundary";
import { amountCreate, actionCreate } from "../logfinder/create";
import { useNetwork, useRequest } from "../HOCs/WithFetch";
import { Denoms } from "../store/DenomStore";
import { ActionLogfinderRuleSet } from "../store/ActionLogfinderRuleSetStore";
import { AmountLogfinderRuleSet } from "../store/AmountLoginfderRuleSetStore";
import useTerraAssets from "../hooks/useTerraAssets";
import Header from "./Header";
import { Whitelist } from "../store/WhitelistStore";
import { Contracts } from "../store/ContractStore";
import { transformChainId } from "../scripts/utility";
import s from "./App.module.scss";

type TokenList = Dictionary<Whitelist>;
type ContractList = Dictionary<Contracts>;

const App = () => {
  const chainId = useNetwork();
  const network = transformChainId(chainId);

  const { data: whitelist } =
    useTerraAssets<Dictionary<TokenList>>("cw20/tokens.json");
  const { data: contracts } = useTerraAssets<Dictionary<ContractList>>(
    "cw20/contracts.json"
  );
  const response: ActiveDenom = useRequest({ url: `/oracle/denoms/actives` });

  const setWhitelist = useSetRecoilState(Whitelist);
  const setContracts = useSetRecoilState(Contracts);
  const setActionRuleArray = useSetRecoilState(ActionLogfinderRuleSet);
  const setAmountRuleArray = useSetRecoilState(AmountLogfinderRuleSet);
  const setDenoms = useSetRecoilState(Denoms);

  useEffect(() => {
    const actionRules = actionCreate(network);
    const amountRules = amountCreate();
    setActionRuleArray(actionRules);
    setAmountRuleArray(amountRules);
    if (whitelist && contracts && response.data?.result) {
      setWhitelist(whitelist[network]);
      setContracts(contracts[network]);
      setDenoms(response.data.result);
    }
  }, [
    response,
    network,
    whitelist,
    contracts,
    chainId,
    setDenoms,
    setWhitelist,
    setContracts,
    setActionRuleArray,
    setAmountRuleArray
  ]);

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
