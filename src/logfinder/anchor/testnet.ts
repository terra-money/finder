const bLunaAddress = "terra1u0t35drzyy0mujj8rkdyzhe264uls4ug3wdp3x";
const bLunaHubAddress = "terra1fflas6wv4snv8lsda9knvq2w0cyt493r8puh2e";
const bLunaRwardAddress = "terra1ac24j6pdxh53czqyrkr6ygphdeftg7u3958tl2";
const aUSTAddress = "terra1ajt556dpzvjwl0kl5tzku3fc3p3knkg9mkv8jl";
const ANCAddress = "terra1747mad58h0w4y589y3sk84r5efqdev9q4r02pc";
const ANCPairAddress = "terra1wfvczps2865j0awnurk9m04u7wdmd6qv3fdnvz";
const marketAddress = "terra15dwd5mj8v59wpj0wvt233mf5efdff808c5tkal";
const bLunaCustodyAddress = "terra1ltnkx0mv7lf2rca9f8w740ashu93ujughy4s7p";
const LPStakingAddress = "terra19nxz35c8f7t3ghdxrxherym20tux8eccar0c3k";
const AncUstLPAddress = "terra1vg0qyq92ky9z9dp0j9fv5rmr2s80sg605dah6f";
const govAddress = "terra16ckeuu7c6ggu52a8se005mg5c0kd2kmuun63cu";
const airdropAddress = "terra1u5ywhlve3wugzqslqvm8ks2j0nsvrqjx0mgxpk";

const testnet = {
  depositStableRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", marketAddress],
      ["action"],
      ["depositor"],
      ["mint_amount"],
      ["deposit_amount"],
      ["contract_address"],
      ["action"],
      ["to"],
      ["amount"]
    ]
  },
  redeemStableRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", aUSTAddress],
      ["action", "send"],
      ["from"],
      ["to", marketAddress],
      ["amount"],
      ["contract_address", marketAddress],
      ["action", "redeem_stable"],
      ["burn_amount"],
      ["redeem_amount"],
      ["contract_address", aUSTAddress],
      ["action", "burn"],
      ["from", marketAddress],
      ["amount"]
    ]
  },
  bondLunaRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", bLunaHubAddress],
      ["action", "mint"],
      ["from"],
      ["bonded"],
      ["minted"],
      ["contract_address"],
      ["action", "mint"],
      ["to"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["holder_address"],
      ["amount"]
    ]
  },
  unbondLunaRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", bLunaAddress],
      ["action"],
      ["from"],
      ["to"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["holder_address"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["holder_address"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["from"],
      ["burnt_amount"],
      ["unbonded_amount"],
      ["contract_address"],
      ["action"],
      ["from"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["holder_address"],
      ["amount"]
    ]
  },
  withdrawUnbondedRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", bLunaHubAddress],
      ["action", "finish_burn"],
      ["from", bLunaHubAddress],
      ["amount"]
    ]
  },
  claimRewardRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", bLunaRwardAddress],
      ["action", "claim_reward"],
      ["holder_address"],
      ["rewards"]
    ]
  },
  depositCollateralRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", bLunaAddress],
      ["action", "send"],
      ["from"],
      ["to", bLunaCustodyAddress],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["holder_address"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["holder_address"],
      ["amount"],
      ["contract_address", bLunaCustodyAddress],
      ["action", "deposit_collateral"],
      ["borrower"],
      ["amount"]
    ]
  },
  lockCollateralRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "lock_collateral"],
      ["borrower"],
      ["collaterals"],
      ["contract_address", bLunaCustodyAddress],
      ["action"],
      ["borrower"],
      ["amount"]
    ]
  },
  unlockCollateralRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "unlock_collateral"],
      ["borrower"],
      ["collaterals"],
      ["contract_address", bLunaCustodyAddress],
      ["action"],
      ["borrower"],
      ["amount"]
    ]
  },
  withdrawCollateralRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", bLunaCustodyAddress],
      ["action", "withdraw_collateral"],
      ["borrower"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["from"],
      ["to"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["holder_address"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["holder_address"],
      ["amount"]
    ]
  },
  borrowStableRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", marketAddress],
      ["action", "borrow_stable"],
      ["borrower"],
      ["borrow_amount"]
    ]
  },
  repayStableRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", marketAddress],
      ["action", "repay_stable"],
      ["borrower"],
      ["repay_amount"]
    ]
  },
  ustSwapRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", ANCAddress],
      ["action", "send"],
      ["from"],
      ["to", ANCPairAddress],
      ["amount"],
      ["contract_address", ANCPairAddress],
      ["action", "swap"],
      ["offer_asset"],
      ["ask_asset"],
      ["offer_amount", ANCAddress],
      ["return_amount"],
      ["tax_amount"],
      ["spread_amount"],
      ["commission_amount"]
    ]
  },
  stakeLPRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", AncUstLPAddress],
      ["action", "send"],
      ["from"],
      ["to", LPStakingAddress],
      ["amount"],
      ["contract_address", LPStakingAddress],
      ["action", "bond"],
      ["owner"],
      ["amount"]
    ]
  },
  unstakeLPRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", LPStakingAddress],
      ["action", "unbond"],
      ["owner"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["from"],
      ["to"],
      ["amount"]
    ]
  },
  airdropRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", airdropAddress],
      ["action", "claim"],
      ["stage"],
      ["address"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["from"],
      ["to"],
      ["amount"]
    ]
  },
  lpStakingRewardRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", LPStakingAddress],
      ["action", "withdraw"],
      ["owner"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["from"],
      ["to"],
      ["amount"]
    ]
  },
  borrowRewardsRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", marketAddress],
      ["action", "claim_rewards"],
      ["claim_amount"],
      ["contract_address"],
      ["action", "spend"],
      ["recipient"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["from"],
      ["to"],
      ["amount"]
    ]
  },
  govStakeRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", ANCAddress],
      ["action", "send"],
      ["from"],
      ["to", govAddress],
      ["amount"],
      ["contract_address", govAddress],
      ["action", "staking"],
      ["sender"],
      ["share"],
      ["amount"]
    ]
  },
  govUnstakeRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", govAddress],
      ["action", "withdraw"],
      ["recipient"],
      ["amount"],
      ["contract_address"],
      ["action"],
      ["from"],
      ["to"],
      ["amount"]
    ]
  },
  createPollRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", ANCAddress],
      ["action", "send"],
      ["from"],
      ["to", govAddress],
      ["amount"],
      ["contract_address", govAddress],
      ["action", "create_poll"],
      ["creator"],
      ["poll_id"],
      ["end_height"]
    ]
  },
  castVoteRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", govAddress],
      ["action", "cast_vote"],
      ["poll_id"],
      ["amount"],
      ["voter"],
      ["vote_option"]
    ]
  }
};

export default testnet;
