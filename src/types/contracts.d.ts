interface Contract {
  owner: string;
  code_id: number;
  init_msg: string;
  txhash: string;
  timestamp: string;
  contract_address: string;
  migratable: boolean;
  migrate_msg: null;
  info: Info;
  code: Code;
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
