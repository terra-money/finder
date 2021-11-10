import { useParams } from "react-router-dom";
import WithFetch from "../../HOCs/WithFetch";
import Loading from "../../components/Loading";
import Delegations from "./Delegations";
import Unbondings from "./Unbondings";
import CopyAddress from "./CopyAddress";
import TokenBalance from "./TokenBalance";
import Txs from "./Txs";

const Account = () => {
  const { address = "" } = useParams();

  return (
    <WithFetch url={`/v1/bank/${address}`} loading={<Loading />}>
      {({ balance, vesting }: Account) => (
        <>
          <h2 className="title">Account Detail</h2>

          <CopyAddress>{address}</CopyAddress>

          <TokenBalance address={address} balance={balance} vesting={vesting} />

          <WithFetch url={`/v1/staking/${address}`}>
            {(staking: Staking) => (
              <>
                <Delegations staking={staking} />
                <Unbondings staking={staking} />
              </>
            )}
          </WithFetch>
          <Txs address={address} />
        </>
      )}
    </WithFetch>
  );
};

export default Account;
