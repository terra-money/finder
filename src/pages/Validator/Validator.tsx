import React from "react";
import { useParams } from "react-router-dom";
import WithFetch from "../../HOCs/WithFetch";
import Card from "../../components/Card";
import Page from "../../components/Page";
import Header from "./Header";
import Informations from "./Informations";
import Rewards from "./Rewards";
import Claims from "./Claims";

const Validator = () => {
  const { address = "" } = useParams();

  return (
    <WithFetch url={`/v1/staking/validators/${address}`}>
      {(v: Validator) => (
        <Page title="Validator Details">
          <Header {...v} />

          <Card>
            <Informations {...v} />
          </Card>

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
