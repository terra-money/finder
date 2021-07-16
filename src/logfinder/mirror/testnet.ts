const mintAddress = "terra1s9ehcjv0dqj2gsl72xrpp0ga5fql7fj7y3kq3w";
const stakingAddress = "terra1a06dgl27rhujjphsn4drl242ufws267qxypptx";
const govAddress = "terra12r5ghc6ppewcdcs3hkewrz24ey6xl7mmpk478s";
const airdropAddress = "terra1p6nvyw7vz3fgpy4nyh3q3vc09e65sr97ejxn2p";
const limitOrderAddress = "terra1vc4ch0z3n6c23f9uywzy5yqaj2gmpnam8qgge7";
const MIRAddress = "terra10llyp6v3j3her8u3ce66ragytu45kcmd9asj3u";

const testnet = {
  openPosition: {
    type: "from_contract",
    attributes: [
      ["contract_address", mintAddress],
      ["action", "open_position"],
      ["position_idx"],
      ["mint_amount"],
      ["collateral_amount"],
      ["action"],
      ["to"],
      ["amount"]
    ]
  },
  depositRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", mintAddress],
      ["action", "deposit"],
      ["position_idx"],
      ["deposit_amount"]
    ]
  },
  withdrawRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", mintAddress],
      ["action", "withdraw"],
      ["position_idx"],
      ["withdraw_amount"],
      ["tax_amount"],
      ["protocol_fee"]
    ]
  },
  burnRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "send"],
      ["from"],
      ["to", mintAddress],
      ["amount"],
      ["contract_address", mintAddress],
      ["action", "burn"],
      ["position_idx"],
      ["burn_amount"],
      ["contract_address"],
      ["action", "burn"],
      ["from"],
      ["amount"]
    ]
  },
  stakeLPRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "send"],
      ["from"],
      ["to", stakingAddress],
      ["amount"],
      ["contract_address", stakingAddress],
      ["action", "bond"],
      ["asset_token"],
      ["amount"]
    ]
  },
  unstakeLPRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", stakingAddress],
      ["action", "unbond"],
      ["asset_token"],
      ["amount"],
      ["contract_address"],
      ["action", "transfer"],
      ["from", stakingAddress],
      ["to"],
      ["amount"]
    ]
  },
  lpStakingRewardRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", stakingAddress],
      ["action", "withdraw"],
      ["amount"],
      ["contract_address"],
      ["action", "transfer"],
      ["from", stakingAddress],
      ["to"],
      ["amount"]
    ]
  },
  govStakeRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
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
      ["contract_address"],
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
  buySubmitOrderRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", limitOrderAddress],
      ["action", "submit_order"],
      ["order_id"],
      ["bidder_addr"],
      ["offer_asset"],
      ["ask_asset"]
    ]
  },
  sellSubmitOrderRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "send"],
      ["from"],
      ["to", limitOrderAddress],
      ["amount"],
      ["contract_address", limitOrderAddress],
      ["action", "submit_order"],
      ["order_id"],
      ["bidder_addr"],
      ["offer_asset"],
      ["ask_asset"]
    ]
  },
  cancelOrderRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", limitOrderAddress],
      ["action", "cancel_order"],
      ["order_id"],
      ["bidder_refund"]
    ]
  },
  buyExecuteOrderRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "send"],
      ["from"],
      ["to", limitOrderAddress],
      ["amount"],
      ["contract_address", limitOrderAddress],
      ["action", "execute_order"],
      ["order_id"],
      ["executor_receive"],
      ["bidder_receive"],
      ["contract_address"],
      ["action"],
      ["from"],
      ["to"],
      ["amount"]
    ]
  },

  sellExecuteOrderRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", limitOrderAddress],
      ["action", "execute_order"],
      ["order_id"],
      ["executor_receive"],
      ["bidder_receive"],
      ["contract_address"],
      ["action"],
      ["from"],
      ["to"],
      ["amount"]
    ]
  },
  transferRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", MIRAddress],
      ["action", "transfer"],
      ["from"],
      ["to"],
      ["amount"]
    ]
  },
  longFarm: {
    type: "from_contract",
    attributes: [
      ["contract_address", stakingAddress],
      ["action", "bond"],
      ["staker_addr"],
      ["asset_token"],
      ["amount"]
    ]
  },
  borrow: {
    type: "from_contract",
    attributes: [
      ["contract_address", mintAddress],
      ["action", "open_position"],
      ["position_idx"],
      ["mint_amount"],
      ["collateral_amount"],
      ["is_short"],
      ["contract_address"],
      ["action", "mint"],
      ["to"],
      ["amount"]
    ]
  },
  unlockAmount: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "unlock_shorting_funds"],
      ["unlocked_amount"],
      ["tax_amount"]
    ]
  }
};

export default testnet;
