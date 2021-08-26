interface Log {
  msg_index: string;
  success: boolean;
  events: Events[];
  // log can be empty string with success
  log:
    | string
    | {
        tax: string;
        // when failure
        code?: number;
        message?: string;
      };
}

interface Events {
  type: string;
  attributes: Attributes[];
}

interface Attributes {
  key: string;
  value?: string;
}

interface Tag {
  key: string;
  value: string;
}

interface Msg {
  type: string;
  value: Any;
}

interface Amount {
  denom: string;
  amount: string;
}

interface Fee {
  amount: Amount[];
  gas: string;
}

interface PubKey {
  type: string;
  value: string;
}

interface Signature {
  pub_key: PubKey;
  signature: string;
}

interface Value {
  msg: Msg[];
  fee: Fee;
  signatures: Signature[];
  memo: string;
}

interface Tx {
  type: string;
  value: Value;
}

interface TxResponse {
  id: number;
  height: string;
  txhash: string;
  code?: number;
  raw_log: string;
  logs: Log[];
  gas_wanted: string;
  gas_used: string;
  tags: Tag[];
  tx: Tx;
  timestamp: string;
  chainId?: string;
}
