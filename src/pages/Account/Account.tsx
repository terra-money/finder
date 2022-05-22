import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useLCDClient from "../../hooks/useLCD";
import NotFound from "../../components/NotFound";
import Delegations from "./Delegations";
import Undelegations from "./Undelegations";
import CopyAddress from "./CopyAddress";
import TokenBalance from "./TokenBalance";
import Txs from "./Txs";

const Account = () => {
  const { address = "" } = useParams();
  const lcd = useLCDClient();
  const { data: accountInfo } = useQuery(
    [address, "accountInfo", lcd.config],
    () => lcd.auth.accountInfo(address)
  );

  return accountInfo ? (
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
