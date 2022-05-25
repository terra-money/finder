import { TxInfo } from "@terra-money/terra.js";
import { pick, pickBy } from "lodash";

interface Transaction extends TxInfo {
  chainId: string;
}

export const transformTx = (tx: any, network: string): TxResponse => {
  if (network.startsWith("columbus")) {
    // old fcd
    return tx;
  }

  try {
    const intermediate = pickBy(
      pick(tx, [
        "height",
        "txhash",
        "logs",
        "gas_wanted",
        "gas_used",
        "codespace",
        "code",
        "timestamp",
        "raw_log",
        "chainId"
      ])
    ) as Pick<
      Transaction,
      | "height"
      | "txhash"
      | "logs"
      | "gas_wanted"
      | "gas_used"
      | "codespace"
      | "code"
      | "timestamp"
      | "raw_log"
    >;

    const { auth_info, body } = tx.tx;

    const amount: any = auth_info.fee.amount;
    const fee = { denom: amount[0]?.denom, amount: amount[0]?.amount };
    return {
      ...intermediate,
      height: String(intermediate.height),
      tx: {
        type: "core/StdTx",
        value: {
          fee: {
            amount: [fee],
            gas: String(auth_info.fee.gas_limit)
          },
          msg: body.messages.map((m: any) => {
            const type = JSON.stringify(body.messages[0]);
            const data = convertProtoType(JSON.parse(type)["@type"]);

            return {
              type: data,
              value: pick(
                m,
                Object.keys(m).filter(key => key !== "@type")
              )
            };
          }),
          memo: body.memo
        }
      }
    };
  } catch {
    return tx;
  }
};

const convertProtoType = (protoType: string): string => {
  // '/terra.oracle.v1beta1.MsgAggregateExchangeRatePrevote' ->
  // [ 'terra', 'oracle', 'v1beta1', 'MsgAggregateExchangeRatePrevote' ]
  const tokens = protoType.match(/([a-zA-Z0-9]+)/g);

  if (!tokens) {
    return protoType;
  }

  let type: string;

  if (tokens[0] === "terra" || tokens[0] === "cosmos") {
    type = `${tokens[1]}/${tokens[tokens.length - 1]}`;
  } else {
    type = `${tokens[0]}/${tokens[tokens.length - 1]}`;
  }

  type = type
    .replace(
      "distribution/MsgSetWithdrawAddress",
      "distribution/MsgModifyWithdrawAddress"
    )
    .replace(
      "distribution/MsgWithdrawDelegatorReward",
      "distribution/MsgWithdrawDelegationReward"
    )
    .replace("authz/MsgGrant", "msgauth/MsgGrantAuthorization")
    .replace("authz/MsgRevoke", "msgauth/MsgRevokeAuthorization")
    .replace("authz/MsgExec", "msgauth/MsgExecAuthorized")
    .replace("ibc/MsgTransfer", "cosmos-sdk/MsgTransfer");

  return type;
};
