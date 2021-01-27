import React from "react";
import { AccAddress, ValAddress } from "@terra-money/terra.js";
import { isValid } from "date-fns";
import BigNumber from "bignumber.js";
import Address from "./Address";

type Props = {
  value: string;
  formatExact?: boolean;
};

const Formatter = ({ value }: Props) => {
  const renderFinder =
    ValAddress.validate(value) || AccAddress.validate(value) ? (
      <Address address={value} />
    ) : undefined;

  if (renderFinder) {
    return renderFinder;
  }

  const renderValue = new BigNumber(value).isFinite()
    ? value
    : isValid(new Date(value))
    ? new Date(value).toLocaleString()
    : undefined;

  if (renderValue) {
    return <>{renderValue}</>;
  }

  return <>{value}</>;
};

export default Formatter;
