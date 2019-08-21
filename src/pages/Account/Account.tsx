import React from "react";
import { RouteComponentProps } from "react-router-dom";
import s from "./Account.module.scss";
import Loading from "../../components/Loading";
import Copy from "../../components/Copy";
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

const TOOLTIP = `This displays your investment with Terra.
Vested Luna can be delegated in the meantime.`;

const Account = ({
  location: { search, pathname },
  match: { params }
}: RouteComponentProps<{ address: string }>) => {
  const { address } = params;

  return (
    <WithFetch url={`/v1/bank/${address}`} loading={<Loading />}>
      {({ balance, vesting }: Account) => (
        <>
          <h2 className="title">Account</h2>
          <Card title="Address" bordered headerClassName={s.cardTitle}>
            {address}
            <Copy text={address} style={{ display: "inline-block" }}></Copy>
          </Card>
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
          {Delegations(address)}
          {Unbondings(address)}
          <Card title="Transactions" bordered headerClassName={s.cardTitle}>
            <div className={s.cardBodyContainer}>
              {Txs(address, search, pathname)}
            </div>
          </Card>
        </>
      )}
    </WithFetch>
  );
};

export default Account;
