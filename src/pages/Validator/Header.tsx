import React from "react";
import c from "classnames";
import { readPercent, readAmount } from "@terra.kitchen/utils";
import { prependProtocol } from "../../scripts/utility";
import Amount from "../../components/Amount";
import Card from "../../components/Card";
import ValidatorStatus from "../../components/ValidatorStatus";
import { calcSelfDelegation, useTerraValidator } from "../../queries/TerraAPI";
import { useVotingPowerRate } from "../../queries/validator";
import s from "./Header.module.scss";

import { ReactComponent as Terra } from "../../Terra.svg";
import { useValidator } from "../../queries/staking";

const thumbnail = { className: s.thumbnail, width: 80, height: 80 };
const Header = ({ address }: { address: string }) => {
  const { data: terraValidator } = useTerraValidator(address);
  const { data: validator } = useValidator(address);

  const { data: votingPowerRate } = useVotingPowerRate(
    terraValidator?.consensus_pubkey?.key ?? ""
  );

  return (
    <Card
      title={
        <header className={s.header}>
          {terraValidator?.picture ? (
            <img src={terraValidator.picture} alt="" {...thumbnail} />
          ) : (
            <Terra {...thumbnail} />
          )}
          <section>
            <h1 className={s.moniker}>
              {validator?.description.moniker}
              <ValidatorStatus
                validatorAddress={validator?.operator_address ?? ""}
                className={s.status}
              />
            </h1>
            <p className={s.p}>
              {validator?.description.website && (
                <a
                  href={prependProtocol(validator.description.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {validator.description.website}
                </a>
              )}
            </p>
            <p className={s.p}>{validator?.description.details}</p>
          </section>
        </header>
      }
      bordered
    >
      {terraValidator && (
        <div className={c("row", s.summary)}>
          <article className="col">
            <h1>Voting power</h1>
            <p>{readPercent(votingPowerRate)}</p>
            <hr />
            <span style={{ fontSize: 14 }}>
              {readAmount(terraValidator.voting_power, {
                decimals: 0,
                comma: true
              })}{" "}
              <small>Luna</small>
            </span>
          </article>

          <article className="col">
            <h1>Self-delegation</h1>
            <p>{readPercent(calcSelfDelegation(terraValidator))}</p>
            <hr />
            <Amount fontSize={14} denom="uluna">
              {terraValidator.self}
            </Amount>
          </article>

          <article className="col">
            <h1>Commission</h1>
            <p>
              {readPercent(terraValidator.commission.commission_rates.rate, {
                fixed: 0
              })}
            </p>
          </article>

          <article className="col">
            <h1>
              Uptime <span className="desktop">(Last 10k blocks)</span>
            </h1>
            <p>
              {readPercent(terraValidator.time_weighted_uptime ?? 0, {
                fixed: 2
              })}
            </p>
          </article>
        </div>
      )}
    </Card>
  );
};

export default Header;
