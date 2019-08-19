interface IValidator {
  accountAddress: string;
  operatorAddress: string;
  description: IDescription;
  votingPower: IVotingPower;
  selfDelegation: IVotingPower;
  commissions: IReward[];
  commissionInfo: ICommissionInfo;
  upTime: number;
  status: string;
  rewardsPool: IRewards;
  myUndelegation: IMyUndelegation[];
  myDelegatable: string;
  myDelegation: string;
  myRewards?: IRewards;
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

interface IRewards {
  total: string;
  denoms: IReward[];
}

interface IReward {
  denom: string;
  amount: string;
  adjustedAmount: string;
}

interface IMyUndelegation {
  releaseTime: string;
  amount: string;
  validatorName: string;
  validatorAddress: string;
}
