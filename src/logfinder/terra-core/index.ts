import { LogFindersRuleSet } from "../types";

const rules = {
  msgSendRule: {
    type: "transfer",
    attributes: [["recipient"], ["sender"], ["amount"]]
  },
  msgWithdrawDelegationRewardRule: {
    type: "withdraw_rewards",
    attributes: [["amount"], ["validator"]]
  },
  msgVoteRule: {
    type: "proposal_vote",
    attributes: [["option"], ["proposal_id"]]
  },
  msgSubmitProposalRule: {
    type: "submit_proposal",
    attributes: [["proposal_id"], ["proposal_type"], ["voting_period_start"]]
  },
  msgDepositRule: {
    type: "proposal_deposit",
    attributes: [["amount"], ["proposal_id"]]
  },
  msgSwapRule: {
    type: "swap",
    attributes: [
      ["offer"],
      ["trader"],
      ["recipient"],
      ["swap_coin"],
      ["swap_fee"]
    ]
  },
  msgSwapTerraSwapRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "swap"],
      ["offer_asset"],
      ["ask_asset"],
      ["offer_amount"],
      ["return_amount"],
      ["tax_amount"],
      ["spread_amount"],
      ["commission_amount"]
    ]
  },
  msgExchangeRateVoteRule: {
    type: "vote",
    attributes: [["denom"], ["voter"], ["exchange_rate"], ["feeder"]]
  },
  msgExchangeRatePrevoteRule: {
    type: "prevote",
    attributes: [["denom"], ["voter"], ["feeder"]]
  },
  msgAggregateExchangeRateVoteRule: {
    type: "aggregate_vote",
    attributes: [["voter"], ["exchange_rates"], ["feeder"]]
  },
  msgAggregateExchangeRatePrevoteRule: {
    type: "aggregate_prevote",
    attributes: [["voter"], ["feeder"]]
  },
  msgUnjailRule: {
    type: "message",
    attributes: [["action", "unjail"], ["module", "slashing"], ["sender"]]
  },
  msgUndelegateRule: {
    type: "unbond",
    attributes: [["validator"], ["amount"], ["completion_time"]]
  },
  msgEditValidatorRule: {
    type: "message",
    attributes: [
      ["action", "edit_validator"],
      ["module", "staking"],
      ["sender"]
    ]
  },
  msgDelegateRule: {
    type: "delegate",
    attributes: [["validator"], ["amount"]]
  },
  msgCreateValidatorRule: {
    type: "create_validator",
    attributes: [["validator"], ["amount"]]
  },
  msgBeginRedelegateRule: {
    type: "redelegate",
    attributes: [
      ["source_validator"],
      ["destination_validator"],
      ["amount"],
      ["completion_time"]
    ]
  },
  msgStoreCodeRule: {
    type: "store_code",
    attributes: [["sender"], ["code_id"]]
  },
  msgMigrateContractRule: {
    type: "migrate_contract",
    attributes: [["code_id"], ["contract_address"]]
  },
  msgInstantiateContractRule: {
    type: "instantiate_contract",
    attributes: [["owner"], ["code_id"], ["contract_address"]]
  }
};

const create = () => {
  const msgSendRuleSet: LogFindersRuleSet = {
    rule: rules.msgSendRule,
    transform: (fragment, matched) => ({
      msgType: "terra/send",
      canonicalMsg: [
        `${matched[1].value} send ${matched[2].value} to ${matched[0].value}`
      ],
      payload: fragment
    })
  };

  const msgWithdrawDelegationRewardRuleSet: LogFindersRuleSet = {
    rule: rules.msgWithdrawDelegationRewardRule,
    transform: (fragment, matched) => ({
      msgType: "terra/withdraw-delegation-reward",
      canonicalMsg: [`Withdraw ${matched[0].value} from ${matched[1].value}`],
      amountIn: `${matched[0].value}`,
      payload: fragment
    })
  };

  const msgVoteRuleSet: LogFindersRuleSet = {
    rule: rules.msgVoteRule,
    transform: (fragment, matched) => ({
      msgType: "terra/vote",
      canonicalMsg: [
        `Vote ${matched[0].value} (Proposal ID: ${matched[1].value})`
      ],
      payload: fragment
    })
  };

  const msgSubmitProposalRuleSet: LogFindersRuleSet = {
    rule: rules.msgSubmitProposalRule,
    transform: (fragment, matched) => ({
      msgType: "terra/submit-proposal",
      canonicalMsg: [`Create proposal (Proposal ID: ${matched[0].value})`],
      payload: fragment
    })
  };

  const msgDepositRuleSet: LogFindersRuleSet = {
    rule: rules.msgDepositRule,
    transform: (fragment, matched) => ({
      msgType: "terra/deposit",
      canonicalMsg: [
        `Deposit ${matched[0].value} (Proposal ID: ${matched[1].value})`
      ],
      amountOut: `${matched[0].value}`,
      payload: fragment
    })
  };

  const msgSwapRuleSet: LogFindersRuleSet = {
    rule: rules.msgSwapRule,
    transform: (fragment, matched) => ({
      msgType: "terra/swap",
      canonicalMsg: [`Swap ${matched[0].value} for ${matched[3].value}`],
      amountIn: `${matched[3].value}`,
      amountOut: `${matched[0].value}`,
      payload: fragment
    })
  };

  const msgExchangeRateVoteRuleSet: LogFindersRuleSet = {
    rule: rules.msgExchangeRateVoteRule,
    transform: (fragment, matched) => ({
      msgType: "terra/exchange-rate-vote",
      canonicalMsg: [`Vote ${matched[2].value} for ${matched[0].value}`],
      payload: fragment
    })
  };

  const msgExchangeRatePrevoteRuleRuleSet: LogFindersRuleSet = {
    rule: rules.msgExchangeRatePrevoteRule,
    transform: (fragment, matched) => ({
      msgType: "terra/exchange-rate-prevote",
      canonicalMsg: [`Prevote for ${matched[0].value}`],
      payload: fragment
    })
  };

  const msgAggregateExchangeRateVoteRuleSet: LogFindersRuleSet = {
    rule: rules.msgAggregateExchangeRateVoteRule,
    transform: (fragment, matched) => ({
      msgType: "terra/aggregate-exchange-rate-vote",
      canonicalMsg: [`Vote ${matched[1].value}`],
      payload: fragment
    })
  };

  const msgAggregateExchangeRatePrevoteRuleSet: LogFindersRuleSet = {
    rule: rules.msgAggregateExchangeRatePrevoteRule,
    transform: fragment => ({
      msgType: "terra/aggregate-exchange-rate-prevote",
      canonicalMsg: [`Prevote for all`],
      payload: fragment
    })
  };

  const msgUnjailRuleSet: LogFindersRuleSet = {
    rule: rules.msgUnjailRule,
    transform: (fragment, matched) => ({
      msgType: "terra/unjail",
      canonicalMsg: [`Unjail ${matched[2].value}`],
      payload: fragment
    })
  };

  const msgUndelegateRuleSet: LogFindersRuleSet = {
    rule: rules.msgUndelegateRule,
    transform: (fragment, matched) => ({
      msgType: "terra/undelegete",
      canonicalMsg: [
        `Undelegete ${matched[1].value}uluna to ${matched[0].value}`
      ],
      amountIn: `${matched[1].value}uluna`,
      payload: fragment
    })
  };

  const msgEditValidatorRuleSet: LogFindersRuleSet = {
    rule: rules.msgEditValidatorRule,
    transform: (fragment, matched) => ({
      msgType: "terra/edit-validator",
      canonicalMsg: [`Edit ${matched[2].value}`],
      payload: fragment
    })
  };

  const msgDelegateRuleSet: LogFindersRuleSet = {
    rule: rules.msgDelegateRule,
    transform: (fragment, matched) => ({
      msgType: "terra/delegate",
      canonicalMsg: [
        `Delegate ${matched[1].value}uluna to ${matched[0].value}`
      ],
      amountOut: `${matched[1].value}uluna`,
      payload: fragment
    })
  };

  const msgCreateValidatorRuleSet: LogFindersRuleSet = {
    rule: rules.msgCreateValidatorRule,
    transform: (fragment, matched) => ({
      msgType: "terra/create-validator",
      canonicalMsg: [`Create ${matched[0].value}`],
      payload: fragment
    })
  };

  const msgBeginRedelegateRuleSet: LogFindersRuleSet = {
    rule: rules.msgBeginRedelegateRule,
    transform: (fragment, matched) => ({
      msgType: "terra/begin-redelegate",
      canonicalMsg: [`Redelegate ${matched[2].value} to ${matched[1].value}`],
      payload: fragment
    })
  };

  const msgStoreCodeRuleSet: LogFindersRuleSet = {
    rule: rules.msgStoreCodeRule,
    transform: (fragment, matched) => ({
      msgType: "terra/store-code",
      canonicalMsg: [`Store ${matched[1].value}`],
      payload: fragment
    })
  };

  const msgMigrateContractRuleSet: LogFindersRuleSet = {
    rule: rules.msgMigrateContractRule,
    transform: (fragment, matched) => ({
      msgType: "terra/migrate-contract",
      canonicalMsg: [`Migrate ${matched[1].value} to code ${matched[0].value}`],
      payload: fragment
    })
  };

  const msgInstantiateContractRuleSet: LogFindersRuleSet = {
    rule: rules.msgInstantiateContractRule,
    transform: (fragment, matched) => ({
      msgType: "terra/instantiate-contract",
      canonicalMsg: [
        `Instantiate ${matched[2].value} to code ${matched[1].value}`
      ],
      payload: fragment
    })
  };

  const msgSwapTerraSwapRuleSet: LogFindersRuleSet = {
    rule: rules.msgSwapTerraSwapRule,
    transform: (fragment, matched) => ({
      msgType: "terra/swap",
      canonicalMsg: [
        `Swap ${matched[4].value}${matched[2].value} for ${matched[5].value}${matched[3].value}`
      ],
      amountIn: `${matched[5].value}${matched[3].value}`,
      amountOut: `${matched[4].value}${matched[2].value}`,
      payload: fragment
    })
  };

  return [
    msgSendRuleSet,
    msgWithdrawDelegationRewardRuleSet,
    msgVoteRuleSet,
    msgSubmitProposalRuleSet,
    msgDepositRuleSet,
    msgSwapRuleSet,
    msgExchangeRateVoteRuleSet,
    msgExchangeRatePrevoteRuleRuleSet,
    msgAggregateExchangeRateVoteRuleSet,
    msgAggregateExchangeRatePrevoteRuleSet,
    msgUnjailRuleSet,
    msgUndelegateRuleSet,
    msgEditValidatorRuleSet,
    msgDelegateRuleSet,
    msgCreateValidatorRuleSet,
    msgBeginRedelegateRuleSet,
    msgStoreCodeRuleSet,
    msgMigrateContractRuleSet,
    msgInstantiateContractRuleSet,
    msgSwapTerraSwapRuleSet
  ];
};
export default create;
