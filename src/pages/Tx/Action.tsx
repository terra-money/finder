import { TxDescription } from "@terra-money/react-widget";
import useNetworkConfig from "../../hooks/useNetworkConfig";
import useLCD from "../../hooks/useLCD";
import s from "./Action.module.scss";

const Action = ({ action }: { action: string }) => {
  const { config } = useLCD();
  const networkConfig = useNetworkConfig();

  const { URL, chainID } = config;
  const networkName = networkConfig?.name || "mainnet";
  return (
    <span className={s.wrapper}>
      <TxDescription
        network={{ name: networkName, URL, chainID }}
        config={{ showAllCoins: true }}
      >
        {action}
      </TxDescription>
    </span>
  );
};

export default Action;
