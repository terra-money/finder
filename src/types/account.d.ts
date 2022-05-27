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
  startTime?: string;
  endTime: string;
  ratio: string;
  freedRate?: string;
  denom: string;
  delayed?: boolean;
  released?: string;
}

interface Vesting {
  denom: string;
  total: string;
  schedules: Schedule[];
  totalReleased?: string;
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
