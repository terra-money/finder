const mintAddress = "terra1wfz7h3aqf4cjmjcvc6s8lxdhh7k30nkczyf0mj";
const stakingAddress = "terra17f7zu97865jmknk7p2glqvxzhduk78772ezac5";
const govAddress = "terra1wh39swv7nq36pnefnupttm2nr96kz7jjddyt2x";
const airdropAddress = "terra1kalp2knjm4cs3f59ukr4hdhuuncp648eqrgshw";
const limitOrderAddress = "terra1zpr8tq3ts96mthcdkukmqq4y9lhw0ycevsnw89";
const MIRAddress = "terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6";

const mainnet = {
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

export default mainnet;
