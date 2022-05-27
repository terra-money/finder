import Card from "../../components/Card";
import Info from "../../components/Info";
import { useIsClassic } from "../../contexts/ChainsContext";
import { useInitialBankBalance } from "../../queries/bank";
import useTokenBalance from "../../hooks/cw20/useTokenBalance";
import { isIbcDenom } from "../../scripts/utility";
import AmountCard from "./AmountCard";
import Available from "./Available";
import AvailableList from "./AvailableList";
import NewVesting from "./NewVesting";
import OldVesting from "./OldVesting";
import s from "./TokenBalance.module.scss";

const TokenBalance = ({ address }: { address: string }) => {
  const tokens = useTokenBalance(address);
  const { data: balance } = useInitialBankBalance(address);
  const nativeBlanace = balance?.filter(({ denom }) => !isIbcDenom(denom));
  const ibcBalance = balance?.filter(({ denom }) => isIbcDenom(denom));

  const isClassic = useIsClassic();

  return (
    <>
      <Card title="Coins" bordered headerClassName={s.cardTitle}>
        {nativeBlanace?.length ? (
          <div className={s.cardBodyContainer}>
            <AvailableList list={nativeBlanace} />
          </div>
        ) : (
          <Card>
            <Info icon="info_outline" title="">
              This account doesn't hold any coins yet.
            </Info>
          </Card>
        )}
      </Card>

      {tokens?.list?.filter(t => t.balance !== "0").length ||
      ibcBalance?.length ? (
        <Card title="Tokens" bordered headerClassName={s.cardTitle}>
          <div className={s.cardBodyContainer}>
            {ibcBalance?.map((balance, key) => (
              <Available
                denom={balance.denom}
                amount={balance.amount.toString()}
                key={key}
              />
            ))}
            {tokens?.list
              ?.filter(t => t.balance !== "0")
              .map((t, i) => (
                <AmountCard
                  key={i}
                  denom={t.symbol}
                  amount={t.balance}
                  icon={t.icon}
                  decimals={t.decimals}
                />
              ))}
          </div>
        </Card>
      ) : null}
      {isClassic ? (
        <OldVesting address={address} />
      ) : (
        <NewVesting address={address} />
      )}
    </>
  );
};

export default TokenBalance;
