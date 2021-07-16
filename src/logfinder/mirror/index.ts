import { LogFindersRuleSet } from "../types";
import mainnet from "./mainnet";
import testnet from "./testnet";

const create = (network: string) => {
  const rules = network === "mainnet" ? mainnet : testnet;

  const mirrorOpenPositionRuleSet: LogFindersRuleSet = {
    rule: rules.openPosition,
    transform: (fragment, matched) => ({
      msgType: "mirror/open-position",
      canonicalMsg: [
        `Deposit ${matched[4].value} (Position ID: ${matched[2].value})`,
        `Mint ${matched[3].value}`
      ],
      amountIn: `${matched[3].value}`,
      amountOut: `${matched[4].value}`,
      payload: fragment
    })
  };

  const mirrorDepositRuleSet: LogFindersRuleSet = {
    rule: rules.depositRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/deposit",
      canonicalMsg: [
        `Deposit ${matched[3].value} (Position ID: ${matched[2].value})`
      ],
      amountOut: `${matched[3].value}`,
      payload: fragment
    })
  };

  const mirrorWithdrawRuleSet: LogFindersRuleSet = {
    rule: rules.withdrawRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/withdraw",
      canonicalMsg: [
        `Withdraw ${matched[3].value} (Position ID: ${matched[2].value})`
      ],
      amountIn: `${matched[3].value}`,
      payload: fragment
    })
  };

  const mirrorBurnRuleSet: LogFindersRuleSet = {
    rule: rules.burnRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/burn",
      canonicalMsg: [
        `Burn ${matched[8].value} (Position ID: ${matched[7].value})`
      ],
      amountOut: `${matched[8].value}`,
      payload: fragment
    })
  };

  const mirrorStakeLPRuleSet: LogFindersRuleSet = {
    rule: rules.stakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/stake-lp",
      canonicalMsg: [`Stake ${matched[8].value}${matched[0].value}`],
      amountOut: `${matched[8].value}${matched[0].value}`,
      payload: fragment
    })
  };

  const mirrorUnstakeLPRuleSet: LogFindersRuleSet = {
    rule: rules.unstakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/unstake-lp",
      canonicalMsg: [`Unstake ${matched[8].value}${matched[4].value}`],
      amountIn: `${matched[8].value}${matched[4].value}`,
      payload: fragment
    })
  };

  const mirrorLPStakingRewardRuleSet: LogFindersRuleSet = {
    rule: rules.lpStakingRewardRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/lp-staking-reward",
      canonicalMsg: [`Claim Reward ${matched[7].value}${matched[3].value}`],
      amountIn: `${matched[7].value}${matched[3].value}`,
      payload: fragment
    })
  };

  const mirrorGovStakeRuleSet: LogFindersRuleSet = {
    rule: rules.govStakeRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/governance-stake",
      canonicalMsg: [
        `Stake ${matched[4].value}${matched[0].value} to ${matched[5].value}`
      ],
      amountOut: `${matched[4].value}${matched[0].value}`,
      payload: fragment
    })
  };

  const mirrorGovUnstakeRuleSet: LogFindersRuleSet = {
    rule: rules.govUnstakeRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/governance-unstake",
      canonicalMsg: [
        `Unstake ${matched[3].value}${matched[4].value} to ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}${matched[4].value}`,
      payload: fragment
    })
  };

  const mirrorCreatePollRuleSet: LogFindersRuleSet = {
    rule: rules.createPollRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/create-poll",
      canonicalMsg: [`Create Poll (Poll ID: ${matched[8].value})`],
      amountOut: `${matched[4].value}`,
      payload: fragment
    })
  };

  const mirrorCastVoteRuleSet: LogFindersRuleSet = {
    rule: rules.castVoteRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/cast-vote",
      canonicalMsg: [
        `Vote to Poll (Poll ID: ${matched[2].value}) (${matched[1].value})`
      ],
      payload: fragment
    })
  };

  const mirrorAirdropRuleSet: LogFindersRuleSet = {
    rule: rules.airdropRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/airdrop",
      canonicalMsg: [`Claim ${matched[9].value}${matched[5].value}`],
      amountIn: `${matched[9].value}${matched[5].value}`,
      payload: fragment
    })
  };

  const mirrorBuySubmitOrderRuleSet: LogFindersRuleSet = {
    rule: rules.buySubmitOrderRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/submit-order-buy",
      canonicalMsg: [
        `Order to buy ${matched[5].value} with ${matched[4].value}`
      ],
      amountOut: `${matched[4].value}`,
      payload: fragment
    })
  };

  const mirrorSellSubmitOrderRuleSet: LogFindersRuleSet = {
    rule: rules.sellSubmitOrderRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/submit-order-sell",
      canonicalMsg: [
        `Order to sell ${matched[9].value} for ${matched[10].value}`
      ],
      amountOut: `${matched[9].value}`,
      payload: fragment
    })
  };

  const mirrorCancelOrderRuleSet: LogFindersRuleSet = {
    rule: rules.cancelOrderRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/cancel-order",
      canonicalMsg: [`Canceled limit order ID:${matched[2].value}`],
      amountIn: `${matched[3].value}`,
      payload: fragment
    })
  };

  const mirrorBuyExecuteOrderRuleSet: LogFindersRuleSet = {
    rule: rules.buyExecuteOrderRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/execute-order-buy",
      canonicalMsg: [`Bought ${matched[9].value} with ${matched[8].value}`],
      amountIn: `${matched[9].value}`,
      amountOut: `${matched[8].value}`,
      payload: fragment
    })
  };

  const mirrorSellExecuteOrderRuleSet: LogFindersRuleSet = {
    rule: rules.sellExecuteOrderRule,
    transform: (fragment, matched) => ({
      msgType: "mirror/execute-order-sell",
      canonicalMsg: [`Sold ${matched[3].value} for ${matched[4].value}`],
      amountIn: `${matched[4].value}`,
      amountOut: `${matched[3].value}`,
      payload: fragment
    })
  };

  const mirrorLPStakeRuleSet: LogFindersRuleSet = {
    rule: rules.longFarm,
    transform: (fragment, matched) => ({
      msgType: "mirror/lp-stake",
      canonicalMsg: [`Stake ${matched[4].value} to ${matched[0].value}`],
      payload: fragment
    })
  };

  const mirrorBorrowRuleSet: LogFindersRuleSet = {
    rule: rules.borrow,
    transform: (fragment, matched) => ({
      msgType: "mirror/borrow",
      canonicalMsg: [`Mint ${matched[3].value} with ${matched[4].value}`],
      amountIn: `${matched[3].value}`,
      amountOut: `${matched[4].value}`,
      payload: fragment
    })
  };

  const mirrorUnlockAmountRuleSet: LogFindersRuleSet = {
    rule: rules.unlockAmount,
    transform: (fragment, matched) => ({
      msgType: "mirror/unlock-amount",
      canonicalMsg: [`Unlock ${matched[2].value}`],
      amountIn: `${matched[2].value}`,
      payload: fragment
    })
  };

  const mirrorRuleArray: LogFindersRuleSet[] = [
    mirrorOpenPositionRuleSet,
    mirrorDepositRuleSet,
    mirrorWithdrawRuleSet,
    mirrorBurnRuleSet,
    mirrorStakeLPRuleSet,
    mirrorUnstakeLPRuleSet,
    mirrorLPStakingRewardRuleSet,
    mirrorGovStakeRuleSet,
    mirrorGovUnstakeRuleSet,
    mirrorCreatePollRuleSet,
    mirrorCastVoteRuleSet,
    mirrorAirdropRuleSet,
    mirrorBuySubmitOrderRuleSet,
    mirrorSellSubmitOrderRuleSet,
    mirrorCancelOrderRuleSet,
    mirrorBuyExecuteOrderRuleSet,
    mirrorSellExecuteOrderRuleSet,
    mirrorLPStakeRuleSet,
    mirrorBorrowRuleSet,
    mirrorUnlockAmountRuleSet
  ];

  return mirrorRuleArray;
};

export default create;
