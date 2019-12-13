interface Log {
  msg_index: string;
  success: boolean;
  log: {
    tax: string;
  };
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
  height: string;
  txhash: string;
  raw_log: string;
  logs: Log[];
  gas_wanted: string;
  gas_used: string;
  tags: Tag[];
  tx: Tx;
  timestamp: Date;
}
