export interface PylonAddresses {
  stakingAddress: string;
  govAddress: string;
  airdropAddress: string;
  MINEAddress: string;
}

export const mainnet: PylonAddresses = {
  stakingAddress: "terra19nek85kaqrvzlxygw20jhy08h3ryjf5kg4ep3l",
  govAddress: "terra1xu8utj38xuw6mjwck4n97enmavlv852zkcvhgp",
  airdropAddress: "terra1ud39n6c42hmtp2z0qmy8svsk7z3zmdkxzfwcf2",
  MINEAddress: "terra1kcthelkax4j9x8d3ny6sdag0qmxxynl3qtcrpy"
};

export const testnet: PylonAddresses = {
  stakingAddress: "terra17av0lfhqymusm6j9jpepzerg6u54q57jp7xnrz",
  govAddress: "terra1hffjqjscxgz5lnmmtwhksrcg4gd3x4nyp9mzwx",
  airdropAddress: "terra1ujnu34ruqvskn65dlmkaamy7l69nstf7q9z3z5",
  MINEAddress: "terra1lqm5tutr5xcw9d5vc4457exa3ghd4sr9mzwdex"
};
