interface Whitelist {
  protocol: string;
  symbol: string;
  token: string;
  icon?: string;
}

interface Contracts {
  protocol: string;
  name: string;
  icon: string;
}

interface Chains {
  name: string;
  chainID: string;
  lcd: string;
}
