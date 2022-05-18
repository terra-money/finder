import { useParams } from "react-router-dom";
import { useTerraValidator } from "../../queries/TerraAPI";
import Card from "../../components/Card";
import Page from "../../components/Page";
import Header from "./Header";
import Informations from "./Informations";
import { useCommission, useRewards } from "../../queries/distribution";
import Rewards from "./Rewards";

const Validator = () => {
  const { address = "" } = useParams();
  const { data: validator } = useTerraValidator(address);
  const rewards = useRewards(address);
  const commissions = useCommission(address);

  return validator ? (
    <Page title="Validator Details">
      <Header {...validator} />

      <Card>
        <Informations {...validator} />
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
  ) : null;
};

export default Validator;
