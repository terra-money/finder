import classNames from "classnames";
import { useValidators } from "../queries/staking";
import { getIsUnbonded } from "../queries/validator";
import { getBadgeClassName } from "../scripts/helper";
import Badge from "./Badge";

interface Props {
  className?: string;
  validatorAddress: string;
}

const ValidatorStatus = (props: Props) => {
  const { className, validatorAddress } = props;
  const { data: validators } = useValidators();
  const info = validators?.find(v => v.operator_address === validatorAddress);

  const status =
    validators &&
    !getIsUnbonded(
      validators.find(
        validator => validator.operator_address === validatorAddress
      )?.status
    );

  const state = info?.jailed ? "jailed" : status ? "active" : "inactive";
  const tag = getBadgeClassName(state);
  return <Badge className={classNames(tag, className)}>{state}</Badge>;
};

export default ValidatorStatus;
