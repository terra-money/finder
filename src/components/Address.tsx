import React, { useContext } from "react";
import { Dictionary } from "ramda";
import { AccAddress } from "@terra-money/terra.js";
import contracts from "../components/contracts.json";
import NetworkContext from "../contexts/NetworkContext";
import Finder from "./Finder";
import s from "./Address.module.scss";

type Data = Dictionary<{ name: string; icon: string }>;

type Prop = { address: string };

const formatAccAddress = (chainId: string, address: string) => {
  const whitelist = (contracts as Dictionary<Data>)[chainId];
  const data = whitelist?.[address];

  return (
    <div className={s.wrapper}>
      {data ? (
        <>
          <Finder q="address" v={address} children={data.name} />
          <img src={data.icon} alt={data.name} className={s.icon} />
        </>
      ) : (
        <Finder q="address" v={address} children={address} />
      )}
    </div>
  );
};

const Address = ({ address }: Prop) => {
  const { network: currentChain } = useContext(NetworkContext);

  if (AccAddress.validate(address)) {
    return formatAccAddress(currentChain, address);
  } else {
    return <Finder q="validator" v={address} children={address} />;
  }
};

export default Address;
