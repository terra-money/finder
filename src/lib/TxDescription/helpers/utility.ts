export const REGEXP = {
  ADDRESS: /(terra1[a-z0-9]{38})|(terravaloper[a-z0-9]{39})/g,
  COIN: /^\d+((terra1[a-z0-9]{38})|(u[a-z]{1,4}))/g,
  IBC: /(ibc)/g
};

export const splitTokenText = (string = "") => {
  const [, amount] = string.split(/(\d+)(\w+)/);
  const [, token] = string.split(REGEXP.COIN);
  return { amount, token };
};

export const isCoins = (word: string) =>
  word.match(REGEXP.COIN) || word.match(REGEXP.IBC);
