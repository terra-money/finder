import { useParams } from "react-router-dom";
import { AccAddress } from "@terra-money/terra.js";
import NotFound from "../../components/NotFound";
import Delegations from "./Delegations";
import Undelegations from "./Undelegations";
import CopyAddress from "./CopyAddress";
import TokenBalance from "./TokenBalance";
import Txs from "./Txs";

const Account = () => {
  const { address = "" } = useParams();
  return AccAddress.validate(address) ? (
    <>
      <h2 className="title">Account Detail</h2>

      <CopyAddress>{address}</CopyAddress>

      <TokenBalance address={address} />
      <Delegations address={address} />
      <Undelegations address={address} />
      <Txs address={address} />
    </>
  ) : (
    <NotFound keyword={address} />
  );
};

export default Account;
