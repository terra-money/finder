import { useMemo } from "react";
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import BigNumber from "bignumber.js";
import { OracleParams, ValAddress } from "@terra-money/terra.js";
import { useCurrentChain } from "../contexts/ChainsContext";
import { RefetchOptions } from "./query";
import { TerraValidator } from "../types/validator";
import { useOracleParams } from "./oracle";

export const useTerraAPIURL = (network?: string) => {
  const { name } = useCurrentChain();
  return {
    mainnet: "https://api.terra.dev",
    testnet: "https://bombay-api.terra.dev"
  }[network ?? name];
};

export const useIsTerraAPIAvailable = () => {
  const url = useTerraAPIURL();
  return !!url;
};

export const useTerraAPI = <T>(path: string, params?: object, fallback?: T) => {
  const baseURL = useTerraAPIURL();
  const available = useIsTerraAPIAvailable();
  const shouldFallback = !available && fallback;

  return useQuery<T, AxiosError>(
    ["terraAPI", baseURL, path, params],
    async () => {
      if (shouldFallback) return fallback;
      const { data } = await axios.get(path, { baseURL, params });
      return data;
    },
    { ...RefetchOptions.INFINITY, enabled: !!(baseURL || shouldFallback) }
  );
};

export const useTerraValidator = (address: ValAddress) => {
  return useTerraAPI<TerraValidator>(`validators/${address}`);
};

/* validators */
export const useTerraValidators = () => {
  return useTerraAPI<TerraValidator[]>("validators", undefined, []);
};

/* helpers */
export const getCalcVotingPowerRate = (TerraValidators: TerraValidator[]) => {
  const total = BigNumber.sum(
    ...TerraValidators.map(({ voting_power = 0 }) => voting_power)
  ).toNumber();

  return (address: ValAddress) => {
    const validator = TerraValidators.find(
      ({ operator_address }) => operator_address === address
    );

    if (!validator) return;
    const { voting_power } = validator;
    return voting_power ? Number(validator.voting_power) / total : undefined;
  };
};

export const calcSelfDelegation = (validator?: TerraValidator) => {
  if (!validator) return;
  const { self, tokens } = validator;
  return self ? Number(self) / Number(tokens) : undefined;
};

export const getCalcUptime = ({ slash_window }: OracleParams) => {
  return (validator?: TerraValidator) => {
    if (!validator) return;
    const { miss_counter } = validator;
    return miss_counter ? 1 - Number(miss_counter) / slash_window : undefined;
  };
};

export const useVotingPowerRate = (address: ValAddress) => {
  const { data: TerraValidators, ...state } = useTerraValidators();
  const calcRate = useMemo(() => {
    if (!TerraValidators) return;
    return getCalcVotingPowerRate(TerraValidators);
  }, [TerraValidators]);

  const data = useMemo(() => {
    if (!calcRate) return;
    return calcRate(address);
  }, [address, calcRate]);

  return { data, ...state };
};

export const useUptime = (validator: TerraValidator) => {
  const { data: oracleParams, ...state } = useOracleParams();

  const calc = useMemo(() => {
    if (!oracleParams) return;
    return getCalcUptime(oracleParams);
  }, [oracleParams]);

  const data = useMemo(() => {
    if (!calc) return;
    return calc(validator);
  }, [calc, validator]);

  return { data, ...state };
};
