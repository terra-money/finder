import React from "react";
import { FC } from "react";
import { useNetwork } from "./helpers/NetworkProvider";
import { FINDER } from "./helpers/constants";

interface Props {
  address: string;
  validator?: boolean;
}

const FinderLink: FC<Props> = ({ children, address, validator }) => {
  const { chainID } = useNetwork();
  const path = validator ? "validator" : "address";
  return (
    <a
      href={`${FINDER}/${chainID}/${path}/${address}`}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export default FinderLink;
