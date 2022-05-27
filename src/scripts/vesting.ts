import { Account, BlockInfo } from "@terra-money/terra.js";
import { div, min, minus } from "./math";

const getVesting = (
  account: Account.Data,
  block: BlockInfo
): Vesting | undefined => {
  try {
    if (
      account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount"
    ) {
      const { base_vesting_account, start_time } = account;
      const { original_vesting, end_time } = base_vesting_account;
      const [total] = original_vesting;
      const { amount, denom } = total;

      const blockTime = Math.floor(
        new Date(block.block.header.time).getTime() / 1000
      );
      const freedRate = getFreedRate(start_time, end_time, blockTime);

      const schedules = [
        {
          startTime: Number(start_time) * 1000,
          endTime: Number(end_time) * 1000,
          amount,
          denom,
          freedRate,
          ratio: "1"
        }
      ];

      return {
        total: total.amount,
        denom: total.denom,
        schedules
      };
    } else if (
      account["@type"] === "/cosmos.vesting.v1beta1.PeriodicVestingAccount"
    ) {
      const { base_vesting_account, start_time, vesting_periods } = account;
      const { original_vesting, end_time } = base_vesting_account;
      const [total] = original_vesting;

      const schedules = vesting_periods.map(vesting => {
        const start = Number(vesting.length) + Number(start_time);
        const [coin] = vesting.amount;
        const { amount, denom } = coin;

        const blockTime = Math.floor(
          new Date(block.block.header.time).getTime() / 1000
        );
        const freedRate = getFreedRate(String(start), end_time, blockTime);
        const ratio = getRatio(total.amount, amount);

        return {
          startTime: Number(start) * 1000,
          endTime: Number(end_time) * 1000,
          amount,
          denom,
          freedRate,
          ratio
        };
      });

      return {
        total: total.amount,
        denom: total.denom,
        schedules
      };
    } else if (
      account["@type"] === "/cosmos.vesting.v1beta1.DelayedVestingAccount"
    ) {
      const { base_vesting_account } = account;
      const { original_vesting, end_time } = base_vesting_account;
      const [total] = original_vesting;
      const { amount, denom } = total;

      const now = Math.floor(new Date().valueOf() / 1000);
      const schedules = [
        {
          endTime: Number(end_time) * 1000,
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
