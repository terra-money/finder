import { ActionLogFindersRuleSet } from "../types";
import { createAnchorRules } from "./rules";
import { mainnet, testnet } from "./addresses";

const create = (network: string) => {
  const addresses = network === "mainnet" ? mainnet : testnet;
  const rules = createAnchorRules(addresses);

  const depositStableRuleSet: ActionLogFindersRuleSet = {
    rule: rules.depositStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/deposit-stable",
      canonicalMsg: [
        `Deposit ${matched[4].value}uusd to ${matched[0].value}`,
        `Mint ${matched[3].value}${matched[5].value}`
      ],
      payload: fragment
    })
  };

  const redeemStableRuleSet: ActionLogFindersRuleSet = {
    rule: rules.redeemStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/redeem-stable",
      canonicalMsg: [
        `Withdraw ${matched[8].value}uusd from ${matched[5].value}`,
        `Burn ${matched[7].value}${matched[9].value}`
      ],
      payload: fragment
    })
  };

  const bondLunaRuleSet: ActionLogFindersRuleSet = {
    rule: rules.bondLunaRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/bond-luna",
      canonicalMsg: [`Mint ${matched[4].value}${matched[5].value}`],
      payload: fragment
    })
  };

  const unbondLunaRuleSet: ActionLogFindersRuleSet = {
    rule: rules.unbondLunaRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/unbond-bluna",
      canonicalMsg: [
        `Unbond ${matched[4].value}${matched[0].value}`,
        `Burn ${matched[16].value}${matched[0].value}`
      ],
      payload: fragment
    })
  };

  const withdrawUnbondedRuleSet: ActionLogFindersRuleSet = {
    rule: rules.withdrawUnbondedRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/withdraw-unbonded",
      canonicalMsg: [
        `Withdraw ${matched[3].value}uluna from ${matched[0].value}`
      ],
      payload: fragment
    })
  };

  const claimRewardRuleSet: ActionLogFindersRuleSet = {
    rule: rules.claimRewardRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/claim-reward",
      canonicalMsg: [
        `Claim ${matched[3].value}uusd rewards from ${matched[0].value}`
      ],
      payload: fragment
    })
  };

  const depositCollateralRuleSet: ActionLogFindersRuleSet = {
    rule: rules.depositCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/deposit-collateral",
      canonicalMsg: [
        `Deposit ${matched[4].value}${matched[0].value} collateral to ${matched[11].value}`
      ],
      payload: fragment
    })
  };

  const lockCollateralRuleSet: ActionLogFindersRuleSet = {
    rule: rules.lockCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/lock-collateral",
      canonicalMsg: [`Lock ${matched[3].value} to ${matched[0].value}`],
      payload: fragment
    })
  };

  const unlockCollateralRuleSet: ActionLogFindersRuleSet = {
    rule: rules.unlockCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/unlock-collateral",
      canonicalMsg: [`Unlock ${matched[3].value} from ${matched[0].value}`],
      payload: fragment
    })
  };

  const withdrawCollateralRuleSet: ActionLogFindersRuleSet = {
    rule: rules.withdrawCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/withdraw-collateral",
      canonicalMsg: [
        `Withdraw ${matched[3].value}${matched[4].value} collateral from ${matched[0].value}`
      ],
      payload: fragment
    })
  };

  const borrowStableRuleSet: ActionLogFindersRuleSet = {
    rule: rules.borrowStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/borrow-stable",
      canonicalMsg: [`Borrow ${matched[3].value}uusd from ${matched[0].value}`],
      payload: fragment
    })
  };

  const repayStableRuleSet: ActionLogFindersRuleSet = {
    rule: rules.repayStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/repay-stable",
      canonicalMsg: [`Repay ${matched[3].value}uusd from ${matched[0].value}`],
      payload: fragment
    })
  };

  const ustSwapRuleSet: ActionLogFindersRuleSet = {
    rule: rules.ustSwapRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/UST-swap",
      canonicalMsg: [
        `Swap ${matched[9].value}${matched[7].value} for ${matched[10].value}${matched[8].value}`
      ],
      payload: fragment
    })
  };

  const stakeLPRuleSet: ActionLogFindersRuleSet = {
    rule: rules.stakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/stake-LP",
      canonicalMsg: [
        `Stake ${matched[4].value}${matched[0].value} to ${matched[3].value}`
      ],
      payload: fragment
    })
  };

  const unstakeLPRuleSet: ActionLogFindersRuleSet = {
    rule: rules.unstakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/unstake-LP",
      canonicalMsg: [
        `Unstake ${matched[3].value}${matched[4].value} from ${matched[0].value}`
      ],
      payload: fragment
    })
  };

  const airdropRuleSet: ActionLogFindersRuleSet = {
    rule: rules.airdropRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/airdrop",
      canonicalMsg: [`Claim ${matched[4].value}${matched[5].value}`],
      payload: fragment
    })
  };

  const lpStakingRewardRuleSet: ActionLogFindersRuleSet = {
    rule: rules.lpStakingRewardRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/LP-staking-reward",
      canonicalMsg: [
        `Claim ${matched[3].value}${matched[4].value} rewards from ${matched[0].value}`
      ],
      payload: fragment
    })
  };

  const borrowRewardRuleSet: ActionLogFindersRuleSet = {
    rule: rules.borrowRewardsRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/borrow-reward",
      canonicalMsg: [
        `Claim ${matched[2].value}${matched[7].value} rewards from ${matched[0].value}`
      ],
      payload: fragment
    })
  };

  const govStakeRuleSet: ActionLogFindersRuleSet = {
    rule: rules.govStakeRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/gov-stake",
      canonicalMsg: [
        `Stake ${matched[4].value}${matched[0].value} to ${matched[3].value}`
      ],
      payload: fragment
    })
  };

  const govUntakeRuleSet: ActionLogFindersRuleSet = {
    rule: rules.govUnstakeRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/gov-unstake",
      canonicalMsg: [
        `Unstake ${matched[3].value}${matched[4].value} from ${matched[0].value}`
      ],
      payload: fragment
    })
  };

  const createPollRuleSet: ActionLogFindersRuleSet = {
    rule: rules.createPollRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/create-poll",
      canonicalMsg: [`Create poll with ID:${matched[8].value}`],
      payload: fragment
    })
  };

  const castVoteRuleSet: ActionLogFindersRuleSet = {
    rule: rules.castVoteRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/cast-vote",
      canonicalMsg: [
        `Vote to poll with ID:${matched[2].value} (${matched[5].value})`
      ],
      payload: fragment
    })
  };

  const bETHmintRule: ActionLogFindersRuleSet = {
    rule: rules.bETHmintRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/mint-bETH",
      canonicalMsg: [`Mint ${matched[3].value}${matched[0].value}`],
      payload: fragment
    })
  };

  const bETHburnRule: ActionLogFindersRuleSet = {
    rule: rules.bETHburnRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/burn-bETH",
      canonicalMsg: [`Burn ${matched[7].value}${matched[0].value}`],
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
    castVoteRuleSet,
    bETHmintRule,
    bETHburnRule
  ];
};

export default create;
