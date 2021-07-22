export interface MirrorAddresses {
  mintAddress: string;
  stakingAddress: string;
  govAddress: string;
  airdropAddress: string;
  limitOrderAddress: string;
  MIRAddress: string;
}

export const mainnet: MirrorAddresses = {
  mintAddress: "terra1wfz7h3aqf4cjmjcvc6s8lxdhh7k30nkczyf0mj",
  stakingAddress: "terra17f7zu97865jmknk7p2glqvxzhduk78772ezac5",
  govAddress: "terra1wh39swv7nq36pnefnupttm2nr96kz7jjddyt2x",
  airdropAddress: "terra1kalp2knjm4cs3f59ukr4hdhuuncp648eqrgshw",
  limitOrderAddress: "terra1zpr8tq3ts96mthcdkukmqq4y9lhw0ycevsnw89",
  MIRAddress: "terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6"
};

export const testnet: MirrorAddresses = {
  mintAddress: "terra1s9ehcjv0dqj2gsl72xrpp0ga5fql7fj7y3kq3w",
  stakingAddress: "terra1a06dgl27rhujjphsn4drl242ufws267qxypptx",
  govAddress: "terra12r5ghc6ppewcdcs3hkewrz24ey6xl7mmpk478s",
  airdropAddress: "terra1p6nvyw7vz3fgpy4nyh3q3vc09e65sr97ejxn2p",
  limitOrderAddress: "terra1vc4ch0z3n6c23f9uywzy5yqaj2gmpnam8qgge7",
  MIRAddress: "terra10llyp6v3j3her8u3ce66ragytu45kcmd9asj3u"
};
