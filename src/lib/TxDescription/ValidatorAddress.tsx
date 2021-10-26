import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { truncate } from "terra-utils";
import { useLCDClient } from "./helpers/NetworkProvider";
import FinderLink from "./FinderLink";

const ValidatorAddress = ({ children: address }: { children: string }) => {
  const lcd = useLCDClient();
  const { data } = useQuery(["validator", address], () =>
    lcd.staking.validator(address)
  );

  const [moniker, setMoniker] = useState<string>();

  useEffect(() => {
    data && setMoniker(data.description.moniker);
  }, [data]);

  return (
    <FinderLink address={address} validator>
      {moniker ?? truncate(address)}
    </FinderLink>
  );
};

export default ValidatorAddress;
