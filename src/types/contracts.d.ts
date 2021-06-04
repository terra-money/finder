interface Contract {
  owner: string;
  code_id: number;
  init_msg: string | object;
  txhash?: string;
  timestamp?: string;
  address: string;
  admin?: string;
  migratable?: boolean;
  migrate_msg?: string | object;
  info?: Info;
  code?: Code;
}

interface Code {
  code_id: string;
  sender: string;
  timestamp: string;
  txhash: string;
  info: Info;
}

interface Info {
  name: string;
  description: string;
  url?: string;
  memo: string;
}
