import { Account, BlockInfo } from "@terra-money/terra.js";
import { div, min, minus } from "./math";

const getVesting = (account: Account.Data, block: BlockInfo) => {
  if (account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount") {
    const { base_vesting_account, start_time } = account;
    const { original_vesting, end_time } = base_vesting_account;
    const [total] = original_vesting;
    const { amount, denom } = total;

    const blockTime = Math.floor(
      new Date(block.block.header.time).getTime() / 1000
    );
    const freedRate = getFreedRate(start_time, end_time, blockTime);
    const ratio = getRatio(start_time, end_time);

    const vestingSchedules = [
      {
        startTime: Number(start_time) * 1000,
        endTime: Number(end_time) * 1000,
        amount,
        denom,
        freedRate,
        ratio
      }
    ];

    return {
      total,
      startTime: Number(start_time) * 1000,
      endTime: Number(end_time) * 1000,
      vestingSchedules
    };
  } else if (
    account["@type"] === "/cosmos.vesting.v1beta1.PeriodicVestingAccount"
  ) {
    const { base_vesting_account, start_time, vesting_periods } = account;
    const { original_vesting, end_time } = base_vesting_account;
    const [total] = original_vesting;

    const vestingSchedules = vesting_periods.map(vesting => {
      const start = Number(vesting.length) + Number(start_time);
      const [coin] = vesting.amount;
      const { amount, denom } = coin;

      const blockTime = Math.floor(
        new Date(block.block.header.time).getTime() / 1000
      );
      const freedRate = getFreedRate(String(start), end_time, blockTime);
      const ratio = getRatio(String(start), end_time);

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
      total,
      startTime: Number(start_time) * 1000,
      endTime: Number(end_time) * 1000,
      vestingSchedules
    };
  } else if (
    account["@type"] === "/cosmos.vesting.v1beta1.DelayedVestingAccount"
  ) {
    const { base_vesting_account } = account;
    const { original_vesting, end_time } = base_vesting_account;
    const [total] = original_vesting;
    const { amount, denom } = total;

    const vestingSchedules = [
      {
        endTime: Number(end_time) * 1000,
        ratio: 0,
        amount,
        denom,
        delayed: true
      }
    ];

    return {
      total,
      endTime: Number(end_time) * 1000,
      vestingSchedules
    };
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

const getRatio = (start_time: string, end_time: string) => {
  const now = Math.floor(new Date().valueOf() / 1000);
  const ratio =
    (now - Number(start_time)) / (Number(end_time) - Number(start_time));
  return ratio < 0 ? 0 : ratio;
};
