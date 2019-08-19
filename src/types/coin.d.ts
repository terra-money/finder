type ICoins = ICoin[] | null;

interface ICoin {
  amount: string;
  denom: string;
}
