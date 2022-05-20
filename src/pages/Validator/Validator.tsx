import { useParams } from "react-router-dom";
import Card from "../../components/Card";
import Page from "../../components/Page";
import Loading from "../../components/Loading";
import NotFound from "../../components/NotFound";
import { useCommission, useRewards } from "../../queries/distribution";
import { useValidator } from "../../queries/staking";
import Informations from "./Informations";
import Header from "./Header";
import Rewards from "./Rewards";

const Validator = () => {
  const { address = "" } = useParams();
  const { data: validator, isLoading } = useValidator(address);
  const rewards = useRewards(address);
  const commissions = useCommission(address);

  return isLoading ? (
    <Loading />
  ) : validator ? (
    <Page title="Validator Details">
      <Header address={address} />

      <Card>
        <Informations address={address} />
      </Card>

      {rewards && commissions ? (
        <>
          <h2>Rewards and commissions</h2>
          <div className="row">
            <div className="col">
              <Rewards title="Rewards pool" list={rewards} />
            </div>

            <div className="col">
              <Rewards title="Commissions" list={commissions.toArray()} />
            </div>
          </div>
        </>
      ) : null}
    </Page>
  ) : (
    <NotFound keyword={address} />
  );
};

export default Validator;
