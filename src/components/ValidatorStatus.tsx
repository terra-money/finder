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

  const status =
    validators &&
    !getIsUnbonded(
      validators.find(
        validator => validator.operator_address === validatorAddress
      )?.status
    );

  return (
    <Badge
      className={classNames(
        getBadgeClassName(status ? "active" : "inactive"),
        className
      )}
    >
      {status ? "Active" : "Inactive"}
    </Badge>
  );
};

export default ValidatorStatus;
