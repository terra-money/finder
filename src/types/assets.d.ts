interface Whitelist {
  protocol: string;
  symbol: string;
  token: string;
  icon?: string;
  decimals?: number;
}

interface Contracts {
  protocol: string;
  name: string;
  icon: string;
}

interface NFTContracts {
  name: string;
  icon: string;
  contract: string;
}

interface ChainOption {
  name: string;
  chainID: string;
  lcd: string;
  mantle?: string;
  hive?: string;
}
