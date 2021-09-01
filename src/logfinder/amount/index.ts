import { AmountLogFindersRuleSet } from "../types";
const rule = {
  nativeMultiSendRule: {
    type: "transfer",
    attributes: [["recipient"], ["amount"]]
  },
  nativeSendRule: {
    type: "transfer",
    attributes: [["recipient"], ["sender"], ["amount"]]
  },
  delegateRule: {
    type: "delegate",
    attributes: [["validator"], ["amount"]]
  },
  unDelegateRule: {
    type: "unbond",
    attributes: [["validator"], ["amount"], ["completion_time"]]
  },
  cw20SendRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "send"],
      ["from"],
      ["to"],
      ["amount"]
    ]
  },
  cw20TransferRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "transfer"],
      ["from"],
      ["to"],
      ["amount"]
    ]
  },
  cw20MintRule: {
    type: "from_contract",
    attributes: [["contract_address"], ["action", "mint"], ["to"], ["amount"]]
  },
  cw20TransferFromRule: {
    type: "from_contract",
    attributes: [
      ["contract_address"],
      ["action", "transfer_from"],
      ["from"],
      ["to"],
      ["by"],
      ["amount"]
    ]
  }
};

const create = () => {
  const nativeSendRule: AmountLogFindersRuleSet = {
    rule: rule.nativeSendRule,
    transform: (fragment, matched) => ({
      type: "send",
      amount: matched[2].value,
      sender: matched[1].value,
      recipient: matched[0].value
    })
  };

  const nativeMultiSendRule: AmountLogFindersRuleSet = {
    rule: rule.nativeMultiSendRule,
    transform: (fragment, matched) => ({
      type: "multiSend",
      amount: matched[1].value,
      sender: "",
      recipient: matched[0].value
    })
  };

  const delegateRule: AmountLogFindersRuleSet = {
    rule: rule.delegateRule,
    transform: (fragment, matched) => ({
      type: "delegate",
      amount: `${matched[1].value}uluna`,
      sender: "",
      recipient: matched[0].value
    })
  };

  const unDelegateRule: AmountLogFindersRuleSet = {
    rule: rule.unDelegateRule,
    transform: (fragment, matched) => ({
      type: "unDelegate",
      amount: `${matched[1].value}uluna`,
      sender: matched[0].value,
      recipient: "",
      withdraw_date: matched[2].value
    })
  };

  const cw20SendRule: AmountLogFindersRuleSet = {
    rule: rule.cw20SendRule,
    transform: (fragment, matched) => ({
      type: "cw20Send",
      amount: `${matched[4].value}${matched[0].value}`,
      sender: matched[2].value,
      recipient: matched[3].value
    })
  };

  const cw20TransferRule: AmountLogFindersRuleSet = {
    rule: rule.cw20TransferRule,
    transform: (fragment, matched) => ({
      type: "cw20Transfer",
      amount: `${matched[4].value}${matched[0].value}`,
      sender: matched[2].value,
      recipient: matched[3].value
    })
  };

  const cw20MintRule: AmountLogFindersRuleSet = {
    rule: rule.cw20MintRule,
    transform: (fragment, matched) => ({
      type: "cw20Mint",
      amount: `${matched[3].value}${matched[0].value}`,
      sender: "",
      recipient: matched[2].value
    })
  };

  const cw20TransferFromRule: AmountLogFindersRuleSet = {
    rule: rule.cw20TransferFromRule,
    transform: (fragment, matched) => ({
      type: "cw20TransferFrom",
      amount: `${matched[5].value}${matched[0].value}`,
      sender: matched[2].value,
      recipient: matched[3].value
    })
  };

  return [
    nativeSendRule,
    nativeMultiSendRule,
    delegateRule,
    unDelegateRule,
    cw20SendRule,
    cw20TransferRule,
    cw20MintRule,
    cw20TransferFromRule
  ];
};

export default create;
