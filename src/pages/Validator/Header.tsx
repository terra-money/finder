import React from "react";
import c from "classnames";
import { percent } from "../../scripts/math";
import { prependProtocol } from "../../scripts/utility";
import { getBadgeClassName } from "../../scripts/helper";
import Amount from "../../components/Amount";
import Badge from "../../components/Badge";
import Card from "../../components/Card";
import format from "../../scripts/format";

import { ReactComponent as Terra } from "../../Terra.svg";
import s from "./Header.module.scss";

const thumbnail = { className: s.thumbnail, width: 80, height: 80 };
const Header = (v: Validator) => (
  <Card
    title={
      <header className={s.header}>
        {v.description.profileIcon ? (
          <img src={v.description.profileIcon} alt="" {...thumbnail} />
        ) : (
          <Terra {...thumbnail} />
        )}
        <section>
          <h1 className={s.moniker}>
            {v.description.moniker}
            <Badge className={c(getBadgeClassName(v.status), s.status)}>
              {v.status}
            </Badge>
          </h1>
          <p className={s.p}>
            {v.description.website && (
              <a
                href={prependProtocol(v.description.website)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {v.description.website}
              </a>
            )}
          </p>
          <p className={s.p}>{v.description.details}</p>
        </section>
      </header>
    }
    bordered
  >
    <div className={c("row", s.summary)}>
      <article className="col">
        <h1>Voting power</h1>
        <p>{percent(v.votingPower.weight)}</p>
        <hr />
        <span style={{ fontSize: 14 }}>
          {format.amount(v.votingPower.amount).split(".")[0]}{" "}
          <small>Luna</small>
        </span>
      </article>

      <article className="col">
        <h1>Self-delegation</h1>
        <p>{percent(v.selfDelegation.weight)}</p>
        <hr />
        <Amount fontSize={14} denom="uluna">
          {v.selfDelegation.amount}
        </Amount>
      </article>

      <article className="col">
        <h1>Commission</h1>
        <p>{percent(v.commissionInfo.rate, 0)}</p>
      </article>

      <article className="col">
        <h1>
          Uptime <span className="desktop">(Last 10k blocks)</span>
        </h1>
        <p>{percent(v.upTime, 0)}</p>
      </article>
    </div>
  </Card>
);

export default Header;
