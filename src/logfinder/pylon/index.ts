import { LogFindersRuleSet } from "../types";
import { createPylonRules } from "./rules";
import { mainnet, testnet } from "./addresses";

const create = (network: string) => {
  const addresses = network === "mainnet" ? mainnet : testnet;
  const rules = createPylonRules(addresses);

  const stakeLPRuleSet: LogFindersRuleSet = {
    rule: rules.stakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/stake-LP",
      canonicalMsg: [`Stake ${matched[8].value}${matched[0].value}`],
      amountOut: `${matched[8].value}${matched[0].value}`,
      payload: fragment
    })
  };

  const unstakeLPRuleSet: LogFindersRuleSet = {
    rule: rules.unstakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/unstake-LP",
      canonicalMsg: [`Unstake ${matched[8].value}${matched[4].value}`],
      amountIn: `${matched[8].value}${matched[4].value}`,
      payload: fragment
    })
  };

  const lpStakingRewardRuleSet: LogFindersRuleSet = {
    rule: rules.lpStakingRewardRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/LP-staking-reward",
      canonicalMsg: [`Claim Reward ${matched[7].value}${matched[3].value}`],
      amountIn: `${matched[7].value}${matched[3].value}`,
      target: matched[6].value,
      payload: fragment
    })
  };

  const govStakeRuleSet: LogFindersRuleSet = {
    rule: rules.govStakeRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/governance-stake",
      canonicalMsg: [
        `Stake ${matched[4].value}${matched[0].value} to ${matched[5].value}`
      ],
      amountOut: `${matched[4].value}${matched[0].value}`,
      target: matched[7].value,
      payload: fragment
    })
  };

  const govUnstakeRuleSet: LogFindersRuleSet = {
    rule: rules.govUnstakeRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/governance-unstake",
      canonicalMsg: [
        `Unstake ${matched[3].value}${matched[4].value} to ${matched[0].value}`
      ],
      amountIn: `${matched[3].value}${matched[4].value}`,
      payload: fragment
    })
  };

  const airdropRuleSet: LogFindersRuleSet = {
    rule: rules.airdropRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/airdrop",
      canonicalMsg: [`Claim ${matched[4].value}${matched[5].value}`],
      amountIn: `${matched[4].value}${matched[5].value}`,
      target: matched[3].value,
      payload: fragment
    })
  };

  return [
    stakeLPRuleSet,
    unstakeLPRuleSet,
    lpStakingRewardRuleSet,
    govStakeRuleSet,
    govUnstakeRuleSet,
    airdropRuleSet
  ];
};
export default create;
