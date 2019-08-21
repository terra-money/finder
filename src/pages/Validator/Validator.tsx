import React from "react";
import { RouteComponentProps } from "react-router-dom";
import WithFetch from "../../HOCs/WithFetch";
import Card from "../../components/Card";
import Page from "../../components/Page";
import Header from "./Header";
import Informations from "./Informations";
import Rewards from "./Rewards";
import Claims from "./Claims";
import Delegations from "./Delegations";
import Delegators from "./Delegators";

const Validator = ({ match }: RouteComponentProps<{ address: string }>) => {
  return (
    <WithFetch url={`/v1/staking/validators/${match.params.address}`}>
      {(v: Validator) => (
        <Page title="Validator Details">
          <Header {...v} />

          <Card>
            <Informations {...v} />
          </Card>

          <h2>Delegations</h2>
          <div className="row">
            <div className="col col-8">
              <Card title="Power events" bordered>
                <Delegations address={v.operatorAddress} />
              </Card>
            </div>

            <div className="col col-4">
              <Card title="Delegators" bordered>
                <Delegators address={v.operatorAddress} />
              </Card>
            </div>
          </div>

          <h2>Rewards and commissions</h2>
          <div className="row">
            <div className="col">
              <Rewards title="Rewards pool" list={v.rewardsPool.denoms} />
            </div>

            <div className="col">
              <Rewards title="Commissions" list={v.commissions} />
            </div>
          </div>

          <Card title="Claim history" bordered>
            <Claims address={v.operatorAddress} />
          </Card>
        </Page>
      )}
    </WithFetch>
  );
};

export default Validator;
