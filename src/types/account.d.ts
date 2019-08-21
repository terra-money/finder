interface Balance {
  denom: string;
  available: string;
  delegatable: string;
  delegatedVesting: string;
  freedVesting: string;
  remainingVesting: string;
  unbonding: string;
}

interface Schedule {
  amount: string;
  startTime: any;
  endTime: any;
  ratio: number;
  freedRate: number;
  denom: string;
}

interface Vesting {
  denom: string;
  total: string;
  schedules: Schedule[];
}

interface Delegation {
  delegator_address: string;
  validator_address: string;
  shares: string;
}

interface Account {
  balance: Balance[];
  vesting: Vesting[];
  delegations: Delegation[];
}
