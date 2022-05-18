import { readAmount } from "@terra.kitchen/utils";
import Card from "../../components/Card";
import FlexTable from "../../components/FlexTable";
import { fromISOTime } from "../../scripts/utility";
import { getFindMoniker } from "../../queries/validator";
import { useUndelegations, useValidators } from "../../queries/staking";

const Undelegations = ({ address }: { address: string }) => {
  const { data: validators } = useValidators();
  const { data: undelegations } = useUndelegations(address);

  if (!undelegations || !validators) {
    return null;
  }

  const data = undelegations.map(validator => {
    const { entries, validator_address } = validator;
    const [entry] = entries;
    const { balance, completion_time } = entry;
    const moniker = (
      <span>{getFindMoniker(validators)(validator_address)}</span>
    );
    const release = <span>{fromISOTime(completion_time.toString())}</span>;
    const amount = (
      <span>{readAmount(balance.toString(), { comma: true })}</span>
    );
    return [moniker, amount, release];
  });

  const head = [`Validator`, `Amount`, `Release time`];
  return undelegations.length ? (
    <Card title={"Undelegations"}>
      <FlexTable head={head} body={data.map(undelegation => undelegation)} />
    </Card>
  ) : null;
};

export default Undelegations;
