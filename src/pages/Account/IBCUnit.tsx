import axios from "axios";
import { useQuery } from "react-query";
import { useCurrentChain } from "../../contexts/ChainsContext";
import { ASSET_URL } from "../../scripts/utility";
import AmountCard from "./AmountCard";

type Props = {
  denom: string;
  available: string;
};

const IBCUnit = ({ denom, available }: Props) => {
  const hash = denom.replace("ibc/", "");
  const data = useIBCWhitelist();
  const tokenInfo = data?.[hash];

  return tokenInfo ? (
    <AmountCard
      amount={available}
      hash={hash}
      path={tokenInfo.path}
      icon={tokenInfo.icon}
      denom={tokenInfo.symbol}
    />
  ) : (
    <></>
  );
};

export default IBCUnit;

/* hook */
const useIBCWhitelist = () => {
  const chainID = useCurrentChain();
  const { data } = useQuery(["IBCWhitelist"], () =>
    axios.get(`${ASSET_URL}/ibc/tokens.json`)
  );

  return data?.data[chainID.name];
};
