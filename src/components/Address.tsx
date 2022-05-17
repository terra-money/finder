import c from "classnames";
import { AccAddress } from "@terra-money/terra.js";
import {
  ContractList,
  TokenList,
  useContracts,
  useWhitelist
} from "../hooks/useTerraAssets";
import format from "../scripts/format";
import Finder from "./Finder";
import Image from "./Image";
import s from "./Address.module.scss";

type Prop = {
  address: string;
  hideIcon?: boolean;
  truncate?: boolean;
  className?: string;
};

const formatAccAddress = (
  address: string,
  whitelist?: TokenList,
  contracts?: ContractList,
  hideIcon?: boolean,
  truncate?: boolean,
  className?: string
) => {
  const token = whitelist?.[address];
  const contract = contracts?.[address];
  const renderAddress = truncate ? format.truncate(address, [8, 8]) : address;
  const isLPtoken = contract?.name?.includes("LP");

  const contractName = contract
    ? isLPtoken
      ? contract.name
      : `(${contract.name} Contract)`
    : undefined;

  const names = token?.symbol || contractName;
  const showProtocolName = !token?.symbol && !isLPtoken && contractName;
  const icon = !hideIcon ? token?.icon || contract?.icon : undefined;

  return (
    <div className={c(s.wrapper, className)}>
      {names ? (
        <>
          {showProtocolName && (
            <span className={s.protocol}>{contract?.protocol}</span>
          )}
          <Finder q="address" v={address} children={names} />
          <Image url={icon} className={s.icon} />
        </>
      ) : (
        <Finder q="address" v={address} children={renderAddress} />
      )}
    </div>
  );
};

const formatValidatorAddress = (
  address: string,
  truncate?: boolean,
  className?: string
) => {
  const renderAddress = truncate ? format.truncate(address, [8, 8]) : address;

  return (
    <div className={c(s.wrapper, className)}>
      <Finder q="validator" v={address} children={renderAddress} />
    </div>
  );
};

const Address = ({ address, hideIcon, truncate, className }: Prop) => {
  const whitelist = useWhitelist();
  const contracts = useContracts();

  if (AccAddress.validate(address)) {
    return formatAccAddress(
      address,
      whitelist,
      contracts,
      hideIcon,
      truncate,
      className
    );
  } else {
    return formatValidatorAddress(address, truncate, className);
  }
};

export default Address;
