import Card from "../../components/Card";
import Flex from "../../components/Flex";
import Icon from "../../components/Icon";
import Info from "../../components/Info";
import Pop from "../../components/Pop";
import Loading from "../../components/Loading";
import WithFetch from "../../HOCs/WithFetch";
import { useInitialBankBalance } from "../../queries/bank";
import useTokenBalance from "../../hooks/cw20/useTokenBalance";
import { isIbcDenom } from "../../scripts/utility";
import AmountCard from "./AmountCard";
import Available from "./Available";
import AvailableList from "./AvailableList";
import Vesting from "./Vesting";
import s from "./TokenBalance.module.scss";

const TOOLTIP = `This displays your investment with Terra.
Vested Luna can be delegated in the meantime.`;

const TokenBalance = ({ address }: { address: string }) => {
  const tokens = useTokenBalance(address);
  const { data: balance } = useInitialBankBalance(address);
  const nativeBlanace = balance?.filter(({ denom }) => !isIbcDenom(denom));
  const ibcBalance = balance?.filter(({ denom }) => isIbcDenom(denom));

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

      <WithFetch
        url={`/v1/bank/${address}`}
        loading={<Loading />}
        renderError={() => null}
      >
        {({ vesting }: Account) => (
          <>
            {vesting.length > 0 && (
              <Card
                title={
                  <Flex>
                    Vesting&nbsp;
                    <Pop
                      tooltip={{
                        content: TOOLTIP,
                        contentStyle: { whiteSpace: "pre" }
                      }}
                    >
                      <Icon name="info" className={s.icon} />
                    </Pop>
                  </Flex>
                }
                bordered
                headerClassName={s.cardTitle}
              >
                <div className={s.cardBodyContainer}>
                  {vesting.map((v, i) => (
                    <Vesting {...v} key={i} />
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </WithFetch>
    </>
  );
};

export default TokenBalance;
