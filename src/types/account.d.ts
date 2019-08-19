interface IBalance {
  denom: string;
  available: string;
  delegatable: string;
  delegatedVesting: string;
  freedVesting: string;
  remainingVesting: string;
  unbonding: string;
}

interface ISchedule {
  amount: string;
  startTime: any;
  endTime: any;
  ratio: number;
  freedRate: number;
  denom: string;
}

interface IVesting {
  denom: string;
  total: string;
  schedules: ISchedule[];
}

interface IDelegation {
  delegator_address: string;
  validator_address: string;
  shares: string;
}

interface IAccount {
  balance: IBalance[];
  vesting: IVesting[];
  delegations: IDelegation[];
}
