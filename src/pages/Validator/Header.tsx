import React from "react";
import c from "classnames";
import { readPercent, readAmount } from "@terra.kitchen/utils";
import { percent } from "../../scripts/math";
import { prependProtocol } from "../../scripts/utility";
import Amount from "../../components/Amount";
import Card from "../../components/Card";
import ValidatorStatus from "../../components/ValidatorStatus";
import { TerraValidator } from "../../types/validator";
import { calcSelfDelegation } from "../../queries/TerraAPI";
import { useVotingPowerRate } from "../../queries/validator";
import s from "./Header.module.scss";

import { ReactComponent as Terra } from "../../Terra.svg";

const thumbnail = { className: s.thumbnail, width: 80, height: 80 };
const Header = (validator: TerraValidator) => {
  const { operator_address, description, consensus_pubkey } = validator;
  const { time_weighted_uptime, voting_power, self, commission } = validator;
  const { commission_rates } = commission;
  const { website, details, moniker } = description;

  const { data: votingPowerRate } = useVotingPowerRate(consensus_pubkey.key);

  return (
    <Card
      title={
        <header className={s.header}>
          {validator.picture ? (
            <img src={validator.picture} alt="" {...thumbnail} />
          ) : (
            <Terra {...thumbnail} />
          )}
          <section>
            <h1 className={s.moniker}>
              {moniker}
              <ValidatorStatus
                validatorAddress={operator_address}
                className={s.status}
              />
            </h1>
            <p className={s.p}>
              {website && (
                <a
                  href={prependProtocol(website)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {website}
                </a>
              )}
            </p>
            <p className={s.p}>{details}</p>
          </section>
        </header>
      }
      bordered
    >
      <div className={c("row", s.summary)}>
        <article className="col">
          <h1>Voting power</h1>
          <p>{readPercent(votingPowerRate)}</p>
          <hr />
          <span style={{ fontSize: 14 }}>
            {readAmount(voting_power, { decimals: 0, comma: true })}{" "}
            <small>Luna</small>
          </span>
        </article>

        <article className="col">
          <h1>Self-delegation</h1>
          <p>{readPercent(calcSelfDelegation(validator))}</p>
          <hr />
          <Amount fontSize={14} denom="uluna">
            {self}
          </Amount>
        </article>

        <article className="col">
          <h1>Commission</h1>
          <p>{readPercent(commission_rates.rate, { fixed: 0 })}</p>
        </article>

        <article className="col">
          <h1>
            Uptime <span className="desktop">(Last 10k blocks)</span>
          </h1>
          <p>{percent(time_weighted_uptime ?? 0, 0)}</p>
        </article>
      </div>
    </Card>
  );
};

export default Header;
