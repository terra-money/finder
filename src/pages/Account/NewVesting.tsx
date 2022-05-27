import { useState } from "react";
import { useQuery } from "react-query";
import Icon from "../../components/Icon";
import Amount from "../../components/Amount";
import useLCDClient from "../../hooks/useLCD";
import { useAccountInfo } from "../../queries/auth";
import { RefetchOptions } from "../../queries/query";
import format from "../../scripts/format";
import getVesting from "../../scripts/vesting";
import AmountCard from "./AmountCard";
import Schedule from "./Schedule";
import VestingCard from "./VestingCard";
import s from "./Vesting.module.scss";

const NewVesting = ({ address }: { address: string }) => {
  const { data: accountInfo } = useAccountInfo(address);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(isOpen => !isOpen);

  const { data: block } = useLatestBlock();
  const info = accountInfo?.toData();

  if (!info || !block) {
    return null;
  }

  const vestingInfo = getVesting(info, block);

  if (!vestingInfo) {
    return null;
  }

  const { total, denom, totalReleased, schedules } = vestingInfo;
  return (
    <VestingCard>
      <AmountCard
        denom={format.denom(denom)}
        amount={total}
        button={
          <button onClick={toggle} className={s.button}>
            <Icon name={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} />
          </button>
        }
      >
        {isOpen && (
          <>
            {Number(totalReleased) > 0 ? (
              <h1>
                Total Released: <Amount denom={denom}>{totalReleased}</Amount>
              </h1>
            ) : null}
            <section className={s.schedules}>
              {schedules.map((s, i) => (
                <Schedule {...s} denom={denom} key={i} />
              ))}
            </section>
          </>
        )}
      </AmountCard>
    </VestingCard>
  );
};

export default NewVesting;

const useLatestBlock = () => {
  const lcd = useLCDClient();
  return useQuery(
    ["latestBlock", lcd.config],
    async () => await lcd.tendermint.blockInfo(),
    { ...RefetchOptions.DEFAULT }
  );
};
