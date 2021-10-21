/* eslint-disable consistent-return */
import React from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { TERRA_ASSETS } from "./helpers/constants";
import { useNetwork, useProps } from "./helpers/NetworkProvider";
import TokenAddress from "./TokenAddress";
import FinderLink from "./FinderLink";

interface ContractInfo {
  protocol: string;
  name: string;
  icon: string;
}

type NetworkName = string;
type Address = string;
type Data = Record<NetworkName, Record<Address, ContractInfo>>;

const TerraAddress = ({ children: address }: { children: string }) => {
  const { name } = useNetwork();
  const { config } = useProps();
  const isMyWallet = address === config?.myWallet;

  const { data: contracts } = useQuery("contracts", async () => {
    const { data: assets } = await axios.get<Data>("/cw20/contracts.json", {
      baseURL: TERRA_ASSETS
    });

    return assets[name];
  });

  const getContractName = (contractAddress: string) => {
    const contract = contracts?.[contractAddress];
    if (!contract) {
      return;
    }
    const { protocol, name: contractName } = contract;

    return [protocol, contractName].join(" ");
  };

  return (
    <FinderLink address={address}>
      {isMyWallet
        ? "My wallet"
        : getContractName(address) ?? <TokenAddress>{address}</TokenAddress>}
    </FinderLink>
  );
};

export default TerraAddress;
