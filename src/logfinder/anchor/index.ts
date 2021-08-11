import { LogFindersRuleSet } from "../types";
import { createAnchorRules } from "./rules";
import { mainnet, testnet } from "./addresses";

const create = (network: string) => {
  const addresses = network === "mainnet" ? mainnet : testnet;
  const rules = createAnchorRules(addresses);

  const depositStableRuleSet: LogFindersRuleSet = {
    rule: rules.depositStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/deposit-stable",
      canonicalMsg: [
        `Deposit ${matched[4].value}uusd to ${matched[0].value}`,
        `Mint ${matched[3].value}${matched[5].value}`
      ],
      amountIn: `${matched[3].value}${matched[5].value}`,
      amountOut: `${matched[4].value}uusd`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const redeemStableRuleSet: LogFindersRuleSet = {
    rule: rules.redeemStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/redeem-stable",
      canonicalMsg: [
        `Withdraw ${matched[8].value}uusd from ${matched[5].value}`,
        `Burn ${matched[7].value}${matched[9].value}`
      ],
      amountIn: `${matched[8].value}uusd`,
      amountOut: `${matched[7].value}${matched[9].value}`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const bondLunaRuleSet: LogFindersRuleSet = {
    rule: rules.bondLunaRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/bond-luna",
      canonicalMsg: [`Mint ${matched[4].value}${matched[5].value}`],
      amountIn: `${matched[4].value}${matched[5].value}`,
      amountOut: `${matched[3].value}uluna`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const unbondLunaRuleSet: LogFindersRuleSet = {
    rule: rules.unbondLunaRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/unbond-bluna",
      canonicalMsg: [
        `Unbond ${matched[4].value}${matched[0].value}`,
        `Burn ${matched[16].value}${matched[0].value}`
      ],
      amountOut: `${matched[16].value}${matched[0].value}`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const withdrawUnbondedRuleSet: LogFindersRuleSet = {
    rule: rules.withdrawUnbondedRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/withdraw-unbonded",
      canonicalMsg: [
        `Withdraw ${matched[3].value}uluna from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}uluna`,
      payload: fragment
    })
  };

  const claimRewardRuleSet: LogFindersRuleSet = {
    rule: rules.claimRewardRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/claim-reward",
      canonicalMsg: [
        `Claim ${matched[3].value}uusd rewards from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}uusd`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const depositCollateralRuleSet: LogFindersRuleSet = {
    rule: rules.depositCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/deposit-collateral",
      canonicalMsg: [
        `Deposit ${matched[4].value}${matched[0].value} to ${matched[11].value}`
      ],
      amountOut: `${matched[4].value}${matched[0].value}`,
      target: matched[15].value,
      payload: fragment
    })
  };

  const lockCollateralRuleSet: LogFindersRuleSet = {
    rule: rules.lockCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/lock-collateral",
      canonicalMsg: [`Lock ${matched[3].value} to ${matched[0].value}`],
      target: matched[2].value,
      payload: fragment
    })
  };

  const unlockCollateralRuleSet: LogFindersRuleSet = {
    rule: rules.unlockCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/unlock-collateral",
      canonicalMsg: [`Unlock ${matched[3].value} from ${matched[0].value}`],
      target: matched[2].value,
      payload: fragment
    })
  };

  const withdrawCollateralRuleSet: LogFindersRuleSet = {
    rule: rules.withdrawCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/withdraw-collateral",
      canonicalMsg: [
        `Withdraw ${matched[3].value}${matched[4].value} from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}${matched[4].value}`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const borrowStableRuleSet: LogFindersRuleSet = {
    rule: rules.borrowStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/borrow-stable",
      canonicalMsg: [`Borrow ${matched[3].value}uusd from ${matched[0].value}`],
      amountIn: `${matched[3].value}uusd`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const repayStableRuleSet: LogFindersRuleSet = {
    rule: rules.repayStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/repay-stable",
      canonicalMsg: [`Repay ${matched[3].value}uusd from ${matched[0].value}`],
      amountOut: `${matched[3].value}uusd`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const ustSwapRuleSet: LogFindersRuleSet = {
    rule: rules.ustSwapRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/UST-swap",
      canonicalMsg: [
        `Swap ${matched[9].value}${matched[7].value} for ${matched[10].value}${matched[8].value}`
      ],
      amountIn: `${matched[10].value}${matched[8].value}`,
      amountOut: `${matched[9].value}${matched[7].value}`,
      payload: fragment
    })
  };

  const stakeLPRuleSet: LogFindersRuleSet = {
    rule: rules.stakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/stake-LP",
      canonicalMsg: [
        `Stake ${matched[4].value}${matched[0].value} to ${matched[3].value}`
      ],
      amountOut: `${matched[4].value}${matched[0].value}`,
      target: matched[7].value,
      payload: fragment
    })
  };

  const unstakeLPRuleSet: LogFindersRuleSet = {
    rule: rules.unstakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/unstake-LP",
      canonicalMsg: [
        `Unstake ${matched[3].value}${matched[4].value} from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}${matched[4].value}`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const airdropRuleSet: LogFindersRuleSet = {
    rule: rules.airdropRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/airdrop",
      canonicalMsg: [`Claim ${matched[4].value}${matched[5].value}`],
      amountIn: `${matched[4].value}${matched[5].value}`,
      target: matched[3].value,
      payload: fragment
    })
  };

  const lpStakingRewardRuleSet: LogFindersRuleSet = {
    rule: rules.lpStakingRewardRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/LP-staking-reward",
      canonicalMsg: [
        `Claim ${matched[3].value}${matched[4].value} rewards from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}${matched[4].value}`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const borrowRewardRuleSet: LogFindersRuleSet = {
    rule: rules.borrowRewardsRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/borrow-reward",
      canonicalMsg: [
        `Claim ${matched[2].value}${matched[7].value} rewards from ${matched[0].value}`
      ],
      amountIn: `${matched[2].value}${matched[7].value}`,
      target: matched[5].value,
      payload: fragment
    })
  };

  const govStakeRuleSet: LogFindersRuleSet = {
    rule: rules.govStakeRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/gov-stake",
      canonicalMsg: [
        `Stake ${matched[4].value}${matched[0].value} to ${matched[3].value}`
      ],
      amountOut: `${matched[4].value}${matched[0].value}`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const govUntakeRuleSet: LogFindersRuleSet = {
    rule: rules.govUnstakeRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/gov-unstake",
      canonicalMsg: [
        `Unstake ${matched[3].value}${matched[4].value} from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}${matched[4].value}`,
      target: matched[2].value,
      payload: fragment
    })
  };

  const createPollRuleSet: LogFindersRuleSet = {
    rule: rules.createPollRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/create-poll",
      canonicalMsg: [`Create poll with ID:${matched[8].value}`],
      target: matched[2].value,
      payload: fragment
    })
  };

  const castVoteRuleSet: LogFindersRuleSet = {
    rule: rules.castVoteRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/cast-vote",
      canonicalMsg: [
        `Vote to poll with ID:${matched[2].value} (${matched[5].value})`
      ],
      target: matched[4].value,
      payload: fragment
    })
  };

  return [
    depositStableRuleSet,
    redeemStableRuleSet,
    bondLunaRuleSet,
    unbondLunaRuleSet,
    withdrawUnbondedRuleSet,
    claimRewardRuleSet,
    depositCollateralRuleSet,
    lockCollateralRuleSet,
    unlockCollateralRuleSet,
    withdrawCollateralRuleSet,
    borrowStableRuleSet,
    repayStableRuleSet,
    ustSwapRuleSet,
    stakeLPRuleSet,
    unstakeLPRuleSet,
    airdropRuleSet,
    lpStakingRewardRuleSet,
    borrowRewardRuleSet,
    govStakeRuleSet,
    govUntakeRuleSet,
    createPollRuleSet,
    castVoteRuleSet
  ];
};

export default create;
