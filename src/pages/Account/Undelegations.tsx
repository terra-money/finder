import { readAmount } from "@terra.kitchen/utils";
import Card from "../../components/Card";
import FlexTable from "../../components/FlexTable";
import ValidatorStatus from "../../components/ValidatorStatus";
import Finder from "../../components/Finder";
import { useIsClassic } from "../../contexts/ChainsContext";
import { fromISOTime } from "../../scripts/utility";
import { getFindMoniker } from "../../queries/validator";
import { useUndelegations, useValidators } from "../../queries/staking";
import s from "./Account.module.scss";

const Undelegations = ({ address }: { address: string }) => {
  const { data: validators } = useValidators();
  const { data: undelegations } = useUndelegations(address);
  const isClassic = useIsClassic();

  if (!undelegations || !validators) {
    return null;
  }

  const data = undelegations.map(validator => {
    const { entries, validator_address } = validator;
    const [entry] = entries;
    const { balance, completion_time, creation_height } = entry;
    const moniker = (
      <Finder q="validator" v={validator_address}>
        {getFindMoniker(validators)(validator_address) ?? validator_address}
      </Finder>
    );

    const status = <ValidatorStatus validatorAddress={validator_address} />;
    const block = <Finder q="block">{String(creation_height)}</Finder>;
    const release = <span>{fromISOTime(completion_time.toString())}</span>;
    const amount = (
      <span>
        {readAmount(balance.toString(), { comma: true })}{" "}
        <small>{isClassic ? "Lunc" : "Luna"}</small>
      </span>
    );
    return [moniker, status, block, amount, release];
  });

  const head = [`Validator`, `Status`, `Block`, `Amount`, `Release time`];
  return undelegations.length ? (
    <Card
      title={"Undelegations"}
      bordered
      headerClassName={s.cardTitle}
      bodyClassName={s.cardBodyContainer}
    >
      <FlexTable
        head={head}
        body={data.map(undelegation => undelegation)}
        tableStyle={{ border: "none" }}
        headStyle={{ background: "none" }}
      />
    </Card>
  ) : null;
};

export default Undelegations;
