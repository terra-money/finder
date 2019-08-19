interface IUndelegation {
  releaseTime: string;
  amount: string;
  validatorName: string;
  validatorAddress: string;
  validatorStatus: string;
  creationHeight: string;
}

interface IDenom {
  denom: string;
  amount: string;
}

interface IRewards {
  total: string;
  denoms: IDenom[];
}

interface IDescription {
  moniker: string;
  identity: string;
  website: string;
  details: string;
  profileIcon: string;
}

interface IVotingPower {
  amount: string;
  weight: string;
}

interface ICommissionInfo {
  rate: string;
  maxRate: string;
  maxChangeRate: string;
  updateTime: any;
}

interface IDenom2 {
  denom: string;
  amount: string;
  adjustedAmount: string;
}

interface IRewardsPool {
  total: string;
  denoms: IDenom2[];
}

interface IMyUndelegation {
  releaseTime: string;
  amount: string;
  validatorName: string;
  validatorAddress: string;
}

interface IValidator {
  operatorAddress: string;
  consensusPubkey: string;
  description: IDescription;
  tokens: string;
  delegatorShares: string;
  votingPower: IVotingPower;
  commissionInfo: ICommissionInfo;
  upTime: number;
  status: string;
  rewardsPool: IRewardsPool;
  myDelegation: string;
  myUndelegation: IMyUndelegation[];
}

interface IReward {
  denom: string;
  amount: string;
}

interface IMyDelegation {
  validatorName: string;
  validatorAddress: string;
  amountDelegated: string;
  rewards: IReward[];
  totalReward: string;
  validatorStatus: string;
}

interface IStaking {
  delegationTotal: string;
  undelegations: IUndelegation[];
  rewards: IRewards;
  validators: IValidator[];
  myDelegations: IMyDelegation[];
  availableLuna: string;
}
