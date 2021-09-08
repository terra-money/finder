import { ActionLogFindersRuleSet } from "../types";
import { createPylonRules } from "./rules";
import { mainnet, testnet } from "./addresses";

const create = (network: string) => {
  const addresses = network === "mainnet" ? mainnet : testnet;
  const rules = createPylonRules(addresses);

  const stakeLPRuleSet: ActionLogFindersRuleSet = {
    rule: rules.stakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/stake-LP",
      canonicalMsg: [`Stake ${matched[8].value}${matched[0].value}`],
      payload: fragment
    })
  };

  const unstakeLPRuleSet: ActionLogFindersRuleSet = {
    rule: rules.unstakeLPRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/unstake-LP",
      canonicalMsg: [`Unstake ${matched[8].value}${matched[4].value}`],
      payload: fragment
    })
  };

  const lpStakingRewardRuleSet: ActionLogFindersRuleSet = {
    rule: rules.lpStakingRewardRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/LP-staking-reward",
      canonicalMsg: [`Claim Reward ${matched[7].value}${matched[3].value}`],
      payload: fragment
    })
  };

  const govStakeRuleSet: ActionLogFindersRuleSet = {
    rule: rules.govStakeRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/governance-stake",
      canonicalMsg: [
        `Stake ${matched[4].value}${matched[0].value} to ${matched[5].value}`
      ],
      payload: fragment
    })
  };

  const govUnstakeRuleSet: ActionLogFindersRuleSet = {
    rule: rules.govUnstakeRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/governance-unstake",
      canonicalMsg: [
        `Unstake ${matched[3].value}${matched[4].value} to ${matched[0].value}`
      ],
      payload: fragment
    })
  };

  const airdropRuleSet: ActionLogFindersRuleSet = {
    rule: rules.airdropRule,
    transform: (fragment, matched) => ({
      msgType: "pylon/airdrop",
      canonicalMsg: [`Claim ${matched[4].value}${matched[5].value}`],
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
