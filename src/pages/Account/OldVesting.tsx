import React, { useState } from "react";
import format from "../../scripts/format";
import { useFCDURL } from "../../contexts/ChainsContext";
import useRequest from "../../hooks/useRequest";
import Icon from "../../components/Icon";
import AmountCard from "./AmountCard";
import Schedule from "./Schedule";
import VestingCard from "./VestingCard";
import s from "./Vesting.module.scss";

const OldVesting = ({ address }: { address: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(isOpen => !isOpen);
  const fcdURL = useFCDURL();
  const { data: bank } = useRequest<Account>({
    url: `${fcdURL}/v1/bank/${address}`
  });

  if (!bank?.vesting || !bank?.vesting.length) {
    return null;
  }

  const { vesting } = bank;

  return (
    <VestingCard>
      {vesting.map(vesting => {
        const { denom, total, schedules } = vesting;
        return (
          <AmountCard
            denom={format.denom(denom)}
            amount={total}
            button={
              <button onClick={toggle} className={s.button}>
                <Icon
                  name={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                />
              </button>
            }
          >
            {isOpen && (
              <section className={s.schedules}>
                {schedules.map((s, i) => (
                  <Schedule {...s} denom={denom} key={i} />
                ))}
              </section>
            )}
          </AmountCard>
        );
      })}
    </VestingCard>
  );
};

export default OldVesting;
