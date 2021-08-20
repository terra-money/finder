import { PylonAddresses } from "./addresses";

export const createPylonRules = ({
  stakingAddress,
  govAddress,
  airdropAddress
}: PylonAddresses) => ({
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
      ["owner"],
      ["amount"]
    ]
  },
  unstakeLPRule: {
    type: "from_contract",
    attributes: [
      ["contract_address", stakingAddress],
      ["action", "unbond"],
      ["owner"],
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
  }
});
