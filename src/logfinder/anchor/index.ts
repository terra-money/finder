import { LogFindersRuleSet } from "../types";
import mainnet from "./mainnet";
import testnet from "./testnet";

const create = (network: string) => {
  const rule = network === "mainnet" ? mainnet : testnet;

  const anchorDepositStableRuleSet: LogFindersRuleSet = {
    rule: rule.depositStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/deposit-stable",
      canonicalMsg: [
        `Deposit ${matched[4].value}uusd to ${matched[0].value}`,
        `Mint ${matched[3].value}${matched[5].value}`
      ],
      amountIn: `${matched[4].value}uusd`,
      amountOut: `${matched[3].value}${matched[5].value}`,
      payload: fragment
    })
  };

  const anchorRedeemStableRuleSet: LogFindersRuleSet = {
    rule: rule.redeemStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/redeem-stable",
      canonicalMsg: [
        `Withdraw ${matched[7].value}uusd from ${matched[5].value}`,
        `Burn ${matched[7].value}${matched[9].value}`
      ],
      amountIn: `${matched[7].value}uusd`,
      amountOut: `${matched[7].value}${matched[9].value}`,
      payload: fragment
    })
  };

  const anchorBondLunaRuleSet: LogFindersRuleSet = {
    rule: rule.bondLunaRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/bond-luna",
      canonicalMsg: [`Mint ${matched[4].value}${matched[5].value}`],
      amountIn: `${matched[4].value}${matched[5].value}`,
      payload: fragment
    })
  };

  const anchorUnbondLunaRuleSet: LogFindersRuleSet = {
    rule: rule.unbondLunaRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/unbond-bluna",
      canonicalMsg: [
        `Unbond ${matched[4].value}${matched[0].value}`,
        `Burn ${matched[16].value}${matched[0].value}`
      ],
      amountOut: `${matched[16].value}${matched[0].value}`,
      payload: fragment
    })
  };

  const anchorWithdrawUnbondedRuleSet: LogFindersRuleSet = {
    rule: rule.withdrawUnbondedRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/withdraw-unbonded",
      canonicalMsg: [
        `Withdraw ${matched[3].value}uluna from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}uluna`,
      payload: fragment
    })
  };

  const anchorClaimRewardRuleSet: LogFindersRuleSet = {
    rule: rule.claimRewardRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/claim-reward",
      canonicalMsg: [
        `Claim ${matched[3].value}uusd rewards from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}uusd`,
      payload: fragment
    })
  };

  const anchorDepositCollateralRuleSet: LogFindersRuleSet = {
    rule: rule.depositCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/deposit-collateral",
      canonicalMsg: [
        `Deposit ${matched[4].value}${matched[0].value} to ${matched[11].value}`
      ],
      amountOut: `${matched[4].value}${matched[0].value}`,
      payload: fragment
    })
  };

  const anchorLockCollateralRuleSet: LogFindersRuleSet = {
    rule: rule.lockCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/lock-collateral",
      canonicalMsg: [`Lock ${matched[3].value} to ${matched[0].value}`],
      payload: fragment
    })
  };

  const anchorUnlockCollateralRuleSet: LogFindersRuleSet = {
    rule: rule.unlockCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/unlock-collateral",
      canonicalMsg: [`Unlock ${matched[3].value} from ${matched[0].value}`],
      payload: fragment
    })
  };

  const anchorWithdrawCollateralRuleSet: LogFindersRuleSet = {
    rule: rule.withdrawCollateralRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/withdraw-collateral",
      canonicalMsg: [
        `Withdraw ${matched[3].value}${matched[4].value} from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}${matched[4].value}`,
      payload: fragment
    })
  };

  const anchorBorrowStableRuleSet: LogFindersRuleSet = {
    rule: rule.borrowStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/borrow-stable",
      canonicalMsg: [`Borrow ${matched[3].value}uusd from ${matched[0].value}`],
      amountIn: `${matched[3].value}uusd`,
      payload: fragment
    })
  };

  const anchorRepayStableRuleSet: LogFindersRuleSet = {
    rule: rule.repayStableRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/repay-stable",
      canonicalMsg: [`Repay ${matched[3].value}uusd from ${matched[0].value}`],
      amountOut: `${matched[3].value}uusd`,
      payload: fragment
    })
  };

  const anchorUstSwapRuleSet: LogFindersRuleSet = {
    rule: rule.ustSwapRule,
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

  const anchorStakeLPRuleSet: LogFindersRuleSet = {
    rule: rule.stakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/stake-lp",
      canonicalMsg: [
        `Stake ${matched[4].value}${matched[0].value} to ${matched[3].value}`
      ],
      amountOut: `${matched[4].value}${matched[0].value}`,
      payload: fragment
    })
  };

  const anchorUnstakeLPRuleSet: LogFindersRuleSet = {
    rule: rule.unstakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/unstake-lp",
      canonicalMsg: [
        `Unstake ${matched[3].value}${matched[4].value} from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}${matched[4].value}`,
      payload: fragment
    })
  };

  const anchorAirdropRuleSet: LogFindersRuleSet = {
    rule: rule.airdropRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/airdrop",
      canonicalMsg: [
        `Claim ${matched[4].value}${matched[5].value} from Anchor Airdrop`
      ],
      amountIn: `${matched[4].value}${matched[5].value}`,
      payload: fragment
    })
  };

  const anchorLPStakingRewardRuleSet: LogFindersRuleSet = {
    rule: rule.lpStakingRewardRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/lp-staking-reward",
      canonicalMsg: [
        `Claim ${matched[3].value}${matched[4].value} rewards from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}${matched[4].value}`,
      payload: fragment
    })
  };

  const anchorBorrowRewardRuleSet: LogFindersRuleSet = {
    rule: rule.borrowRewardsRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/borrow-reward",
      canonicalMsg: [
        `Claim ${matched[2].value}${matched[7].value} rewards from ${matched[0].value}`
      ],
      amountIn: `${matched[2].value}${matched[7].value}`,
      payload: fragment
    })
  };

  const anchorGovStakeRuleSet: LogFindersRuleSet = {
    rule: rule.govStakeRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/gov-stake",
      canonicalMsg: [
        `Stake ${matched[4].value}${matched[0].value} to ${matched[3].value}`
      ],
      amountOut: `${matched[4].value}${matched[0].value}`,
      payload: fragment
    })
  };

  const anchorGovUntakeRuleSet: LogFindersRuleSet = {
    rule: rule.govUnstakeRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/gov-unstake",
      canonicalMsg: [
        `Unstake ${matched[3].value}${matched[4].value} from ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}${matched[4].value}`,
      payload: fragment
    })
  };

  const anchorCreatePollRuleSet: LogFindersRuleSet = {
    rule: rule.createPollRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/create-poll",
      canonicalMsg: [`Create poll with ID:${matched[8].value}`],
      payload: fragment
    })
  };

  const anchorCastVoteRuleSet: LogFindersRuleSet = {
    rule: rule.castVoteRule,
    transform: (fragment, matched) => ({
      msgType: "anchor/cast-vote",
      canonicalMsg: [
        `Vote to poll with ID:${matched[2].value} (${matched[5].value})`
      ],
      payload: fragment
    })
  };

  const anchorRuleArray: LogFindersRuleSet[] = [
    anchorDepositStableRuleSet,
    anchorRedeemStableRuleSet,
    anchorBondLunaRuleSet,
    anchorUnbondLunaRuleSet,
    anchorWithdrawUnbondedRuleSet,
    anchorClaimRewardRuleSet,
    anchorDepositCollateralRuleSet,
    anchorLockCollateralRuleSet,
    anchorUnlockCollateralRuleSet,
    anchorWithdrawCollateralRuleSet,
    anchorBorrowStableRuleSet,
    anchorRepayStableRuleSet,
    anchorUstSwapRuleSet,
    anchorStakeLPRuleSet,
    anchorUnstakeLPRuleSet,
    anchorAirdropRuleSet,
    anchorLPStakingRewardRuleSet,
    anchorBorrowRewardRuleSet,
    anchorGovStakeRuleSet,
    anchorGovUntakeRuleSet,
    anchorCreatePollRuleSet,
    anchorCastVoteRuleSet
  ];

  return anchorRuleArray;
};

export default create;
