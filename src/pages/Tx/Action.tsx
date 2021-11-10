import { TxDescription } from "@terra-money/react-widget";
import { useCurrentChain } from "../../contexts/ChainsContext";
import useLCDClient from "../../hooks/useLCD";
import s from "./Action.module.scss";

const Action = ({ action }: { action: string }) => {
  const { name } = useCurrentChain();
  const { config } = useLCDClient();

  return (
    <span className={s.wrapper}>
      <TxDescription
        network={{ ...config, name }}
        config={{ showAllCoins: true }}
      >
        {action}
      </TxDescription>
    </span>
  );
};

export default Action;
