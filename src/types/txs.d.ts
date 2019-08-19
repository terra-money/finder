interface IAmount {
  denom: string;
  amount: string;
}

interface IFee {
  gas: string;
  amount: IAmount[];
}

interface IValue2 {
  salt: string;
  denom: string;
  price: string;
  feeder: string;
  validator: string;
  hash: string;
}

interface IMsg {
  type: string;
  value: IValue2;
}

interface IPubKey {
  type: string;
  value: string;
}

interface ISignature {
  pub_key: IPubKey;
  signature: string;
}

interface IValue {
  fee: IFee;
  msg: IMsg[];
  memo: string;
  signatures: ISignature[];
}

interface ITx2 {
  type: string;
  value: IValue;
}

interface ILog {
  log: any;
  success: boolean;
  msg_index: string;
}

interface ITag {
  key: string;
  value: string;
}

interface ITx {
  tx: ITx2;
  logs: ILog[];
  tags: ITag[];
  height: string;
  txhash: string;
  raw_log: string;
  gas_used: string;
  timestamp: Date;
  gas_wanted: string;
  code?: number;
}

interface ITxs {
  totalCnt: number;
  page: number;
  limit: number;
  txs: ITx[];
}
