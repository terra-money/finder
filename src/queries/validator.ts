import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { bech32 } from "bech32";
import {
  AccAddress,
  DelegateValidator,
  Validator
} from "@terra-money/terra.js";
/* FIXME(terra.js): Import from terra.js */
import { BondStatus } from "@terra-money/terra.proto/cosmos/staking/v1beta1/staking";
import { bondStatusFromJSON } from "@terra-money/terra.proto/cosmos/staking/v1beta1/staking";
import { useDelegation } from "./staking";
import { useValidatorSet } from "./tendermint";

export const useVotingPowerRate = (pubKey: string) => {
  const { data: validators, ...state } = useValidatorSet();

  const calcRate = useMemo(() => {
    if (!validators) {
      return undefined;
    }
    return getCalcVotingPowerRate(validators, pubKey);
  }, [validators, pubKey]);

  const data = useMemo(() => {
    if (!calcRate) {
      return undefined;
    }
    return calcRate();
  }, [calcRate]);

  return { data, ...state };
};

export const getCalcVotingPowerRate = (
  validators: DelegateValidator[],
  pubKey: string
) => {
  const total = BigNumber.sum(
    ...validators.map(validator => validator.voting_power)
  ).toNumber();

  return () => {
    const validator = validators.find(
      validator => validator.pub_key.key === pubKey
    );

    if (!validator) {
      return undefined;
    }
    const { voting_power } = validator;
    return voting_power ? Number(voting_power) / total : undefined;
  };
};

export const useSelfDelegation = (validator: Validator) => {
  const { tokens, operator_address } = validator;
  const account = AccAddress.fromValAddress(operator_address);
  const { data } = useDelegation(account, operator_address);

  if (!data) return;

  const { balance } = data;
  const { amount } = balance;
  return Number(amount) / Number(tokens);
};

export const getFindValidator =
  (validators: Validator[]) => (address: AccAddress) => {
    const validator = validators.find(v => v.operator_address === address);
    return validator;
  };

export const getFindMoniker =
  (validators: Validator[]) => (address: AccAddress) => {
    const validator = getFindValidator(validators)(address);
    return validator?.description.moniker;
  };

export const convertAddressToHex = (address: string) =>
  Buffer.from(bech32.fromWords(bech32.decode(address).words)).toString("hex");

const validatorCache = new Map();

export const getValidatorOperatorAddressByHexAddress = (
  validators: Validator[],
  validatorSet: DelegateValidator[],
  hex: string
) => {
  const key = hex.toLowerCase();
  if (validatorCache.has(key)) {
    return validatorCache.get(key);
  }

  validatorSet.forEach(s => {
    const v = validators.find(v => v.consensus_pubkey.key === s.pub_key.key);

    if (v) {
      const h = convertAddressToHex(s.address).toLowerCase();
      validatorCache.set(h, v.operator_address);
    }
  });

  return validatorCache.get(key);
};

/* helpers */
export const getIsBonded = (status?: BondStatus) =>
  status
    ? bondStatusFromJSON(BondStatus[status]) === BondStatus.BOND_STATUS_BONDED
    : false;

export const getIsUnbonded = (status?: BondStatus) =>
  status
    ? bondStatusFromJSON(BondStatus[status]) === BondStatus.BOND_STATUS_UNBONDED
    : false;
