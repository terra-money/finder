import { useParams } from "react-router-dom";
import WithFetch from "../../HOCs/WithFetch";
import Delegations from "./Delegations";
import Unbondings from "./Unbondings";
import CopyAddress from "./CopyAddress";
import Txs from "./Txs";
import useTokenBalance from "../../hooks/cw20/useTokenBalance";
import Vesting from "./Vesting";
import Pop from "../../components/Pop";
import Flex from "../../components/Flex";
import Card from "../../components/Card";
import Icon from "../../components/Icon";
import AvailableList from "./AvailableList";
import Info from "../../components/Info";
import AmountCard from "./AmountCard";
import Loading from "../../components/Loading";
import s from "./Account.module.scss";

const TOOLTIP = `This displays your investment with Terra.
Vested Luna can be delegated in the meantime.`;

const Account = () => {
  const { address = "" } = useParams<{ address: string }>();
  const tokens = useTokenBalance(address);

  return (
    <WithFetch url={`/v1/bank/${address}`} loading={<Loading />}>
      {({ balance, vesting }: Account) => (
        <>
          <h2 className="title">Account Detail</h2>

          <CopyAddress>{address}</CopyAddress>

          <Card title="Available" bordered headerClassName={s.cardTitle}>
            {balance.length ? (
              <div className={s.cardBodyContainer}>
                <AvailableList list={balance} />
              </div>
            ) : (
              <Card>
                <Info icon="info_outline" title="">
                  This account doesn't hold any coins yet.
                </Info>
              </Card>
            )}
          </Card>

          {tokens?.list?.filter(t => t.balance !== "0").length ? (
            <Card title="Tokens" bordered headerClassName={s.cardTitle}>
              <div className={s.cardBodyContainer}>
                {tokens.list
                  .filter(t => t.balance !== "0")
                  .map((t, i) => (
                    <AmountCard
                      key={i}
                      denom={t.symbol}
                      amount={t.balance}
                      icon={t.icon}
                    />
                  ))}
              </div>
            </Card>
          ) : undefined}

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
