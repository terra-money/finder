import React from "react";
import { useLocation, useParams } from "react-router-dom";
import s from "./Account.module.scss";
import Loading from "../../components/Loading";
import Info from "../../components/Info";
import Icon from "../../components/Icon";
import Flex from "../../components/Flex";
import Pop from "../../components/Pop";
import Card from "../../components/Card";
import WithFetch from "../../HOCs/WithFetch";
import AvailableList from "./AvailableList";
import Delegations from "./Delegations";
import Unbondings from "./Unbondings";
import Txs from "./Txs";
import Vesting from "./Vesting";
import CopyAddress from "./CopyAddress";
import Contract from "./Contract";

const TOOLTIP = `This displays your investment with Terra.
Vested Luna can be delegated in the meantime.`;

const Account = () => {
  const { search, pathname } = useLocation();
  const { address } = useParams();

  return (
    <WithFetch url={`/v1/bank/${address}`} loading={<Loading />}>
      {({ balance, vesting }: Account) => (
        <>
          <h2 className="title">Account</h2>

          <CopyAddress>{address}</CopyAddress>

          <WithFetch
            url={`/v1/wasm/contract/${address}`}
            loading={<Loading />}
            renderError={() => null}
          >
            {data => <Contract {...data} />}
          </WithFetch>

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
          <Card title="Transactions" bordered headerClassName={s.cardTitle}>
            <div className={s.cardBodyContainer}>
              <Txs address={address} search={search} pathname={pathname} />
            </div>
          </Card>
        </>
      )}
    </WithFetch>
  );
};

export default Account;
