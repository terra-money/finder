import c from "classnames";
import { useRecoilValue } from "recoil";
import { AccAddress } from "@terra-money/terra.js";
import format from "../scripts/format";
import Finder from "./Finder";
import s from "./Address.module.scss";
import { Whitelist } from "../store/WhitelistStore";
import { Contracts } from "../store/ContractStore";
import { Dictionary } from "ramda";

type Prop = {
  address: string;
  hideIcon?: boolean;
  truncate?: boolean;
  className?: string;
};

const formatAccAddress = (
  address: string,
  whitelist: Dictionary<Whitelist>,
  contract: Dictionary<Contracts>,
  hideIcon?: boolean,
  truncate?: boolean,
  className?: string
) => {
  const tokens = whitelist?.[address];
  const contracts = contract?.[address];
  const renderAddress = truncate ? format.truncate(address, [8, 8]) : address;

  return (
    <div className={c(s.wrapper, className)}>
      {tokens || contracts ? (
        <>
          <Finder
            q="address"
            v={address}
            children={tokens?.symbol || contracts?.name}
          />
          {hideIcon ? undefined : (
            <img
              src={tokens?.icon || contracts?.icon}
              alt={tokens?.symbol || contracts?.name}
              className={s.icon}
            />
          )}
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
  const whitelist = useRecoilValue(Whitelist);
  const contracts = useRecoilValue(Contracts);

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
