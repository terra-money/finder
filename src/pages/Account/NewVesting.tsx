import { useQuery } from "react-query";
import c from "classnames/bind";
import Amount from "../../components/Amount";
import useLCDClient from "../../hooks/useLCD";
import { useAccountInfo } from "../../queries/auth";
import { RefetchOptions } from "../../queries/query";
import format from "../../scripts/format";
import { div, percent } from "../../scripts/math";
import getVesting from "../../scripts/vesting";
import AmountCard from "./AmountCard";
import Schedule from "./Schedule";
import VestingCard from "./VestingCard";
import s from "./Vesting.module.scss";

const cx = c.bind(s);

const NewVesting = ({ address }: { address: string }) => {
  const { data: accountInfo } = useAccountInfo(address);
  const { data: block } = useLatestBlock();
  const info = accountInfo?.toData();

  if (!info || !block) {
    return null;
  }

  const vestingInfo = getVesting(info, block);

  if (!vestingInfo) {
    return null;
  }

  const { total, denom, totalReleased, schedules } = vestingInfo;
  const releasedPercent = div(Number(totalReleased), total);
  const isPeriodicVestingAccount = schedules.length > 1;

  return (
    <VestingCard>
      <AmountCard denom={format.denom(denom)} amount={total}>
        <article
          className={cx({
            wrapper: !isPeriodicVestingAccount,
            rowReverse: Number(totalReleased) > 1
          })}
        >
          {Number(totalReleased) > 1 ? (
            <h1 className={s.released}>
              <span className={s.text}>Released:</span>{" "}
              <Amount denom={denom}>{totalReleased}</Amount> |{" "}
              {percent(releasedPercent)}
            </h1>
          ) : null}
          <section className={cx({ schedules: isPeriodicVestingAccount })}>
            {schedules.map((s, i) => (
              <Schedule
                {...s}
                isPeriodicVestingAccount={isPeriodicVestingAccount}
                key={i}
                index={i}
              />
            ))}
          </section>
        </article>
      </AmountCard>
    </VestingCard>
  );
};

export default NewVesting;

const useLatestBlock = () => {
  const lcd = useLCDClient();
  return useQuery(
    ["latestBlock", lcd.config],
    async () => await lcd.tendermint.blockInfo(),
    { ...RefetchOptions.DEFAULT }
  );
};
