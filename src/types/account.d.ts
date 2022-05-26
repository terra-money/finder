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
  startTime?: number;
  endTime: number;
  ratio: number;
  freedRate?: string;
  denom: string;
  delayed?: boolean;
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
