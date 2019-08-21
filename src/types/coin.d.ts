interface Coin {
  amount: string;
  denom: string;
}

type Coins = ICoin[] | null;
