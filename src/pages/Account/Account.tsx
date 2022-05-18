import { useParams } from "react-router-dom";
import WithFetch from "../../HOCs/WithFetch";
import Loading from "../../components/Loading";
import Delegations from "./Delegations";
import Undelegations from "./Undelegations";
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
          <Delegations address={address} />
          <Undelegations address={address} />
          <Txs address={address} />
        </>
      )}
    </WithFetch>
  );
};

export default Account;
