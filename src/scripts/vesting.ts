import { Account, BlockInfo } from "@terra-money/terra.js";
import { div, min, minus, mul, plus } from "./math";

const getVesting = (
  account: Account.Data,
  block: BlockInfo
): Vesting | undefined => {
  try {
    const blockTime = new Date(block.block.header.time).getTime() / 1000;
    const now = new Date().getTime() / 1000;

    if (
      account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount"
    ) {
      const { base_vesting_account, start_time } = account;
      const { original_vesting, end_time } = base_vesting_account;
      const [total] = original_vesting;
      const { amount, denom } = total;

      const freedRate = getFreedRate(start_time, end_time, blockTime);

      const percent = div(minus(start_time, now), minus(start_time, end_time));
      const totalReleased = mul(amount, percent);

      const schedules = [
        {
          startTime: mul(start_time, 1000),
          endTime: mul(end_time, 1000),
          amount,
          denom,
          freedRate,
          ratio: "1",
          released: totalReleased
        }
      ];

      return {
        total: total.amount,
        denom: total.denom,
        schedules,
        totalReleased
      };
    } else if (
      account["@type"] === "/cosmos.vesting.v1beta1.PeriodicVestingAccount"
    ) {
      const { base_vesting_account, start_time, vesting_periods } = account;
      const { original_vesting } = base_vesting_account;
      const [total] = original_vesting;

      let calcStartTime = "0";
      let totalReleased = "0";
      const schedules = vesting_periods.map((vesting, index) => {
        const start = !index
          ? start_time
          : plus(vesting_periods[index - 1].length, calcStartTime);
        const end = plus(start, vesting.length);
        calcStartTime = start;

        const [coin] = vesting.amount;

        const freedRate = getFreedRate(start, end, blockTime);
        const ratio = getRatio(total.amount, coin?.amount);
        const percent = div(minus(start, now), minus(start, end));
        const released = mul(coin?.amount, Number(percent) > 1 ? 1 : percent);
        totalReleased = plus(totalReleased, released);

        return {
          startTime: mul(start, 1000),
          endTime: mul(end, 1000),
          amount: coin?.amount,
          denom: coin?.denom,
          freedRate,
          ratio,
          released
        };
      });

      return {
        total: total.amount,
        denom: total.denom,
        schedules,
        totalReleased
      };
    } else if (
      account["@type"] === "/cosmos.vesting.v1beta1.DelayedVestingAccount"
    ) {
      const { base_vesting_account } = account;
      const { original_vesting, end_time } = base_vesting_account;
      const [total] = original_vesting;
      const { amount, denom } = total;

      const schedules = [
        {
          endTime: mul(end_time, 1000),
          ratio: "1",
          amount,
          denom,
          freedRate: now > Number(end_time) ? "1" : "0",
          delayed: true
        }
      ];

      return {
        total: total.amount,
        denom: total.denom,
        schedules
      };
    }
  } catch {
    return undefined;
  }
};

export default getVesting;

const getFreedRate = (
  startTime: string,
  endTime: string,
  latestBlockTimestamp: number
) => {
  const result = div(
    minus(min([endTime, latestBlockTimestamp]), startTime),
    minus(endTime, startTime)
  );

  return Number(result) < 0 ? "0" : result;
};

const getRatio = (totalAmount: string, vestingAmount: string) =>
  div(vestingAmount, totalAmount);
