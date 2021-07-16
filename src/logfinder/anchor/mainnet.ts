const bLunaAddress = "terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp";
const bLunaHubAddress = "terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts";
const bLunaRwardAddress = "terra17yap3mhph35pcwvhza38c2lkj7gzywzy05h7l0";
const aUSTAddress = "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu";
const ANCAddress = "terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76";
const ANCPairAddress = "terra1gm5p3ner9x9xpwugn9sp6gvhd0lwrtkyrecdn3";
const marketAddress = "terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s";
const bLunaCustodyAddress = "terra1ptjp2vfjrwh0j0faj9r6katm640kgjxnwwq9kn";
const LPStakingAddress = "terra1897an2xux840p9lrh6py3ryankc6mspw49xse3";
const AncUstLPAddress = "terra1gecs98vcuktyfkrve9czrpgtg0m3aq586x6gzm";
const govAddress = "terra1f32xyep306hhcxxxf7mlyh0ucggc00rm2s9da5";
const airdropAddress = "terra146ahqn6d3qgdvmj8cj96hh03dzmeedhsf0kxqm";

const mainnet = {
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

export default mainnet;
