import { useIsClassic } from "../contexts/ChainsContext";
import SelectCurrency from "./SelectCurrency";
import SelectNetworks from "./SelectNetworks";
import s from "./SelectOptions.module.scss";

const SelectOptions = () => {
  const isClassic = useIsClassic();
  return (
    <>
      <SelectNetworks className={isClassic ? s.left : s.right} />
      {isClassic ? <SelectCurrency className={s.right} /> : null}
    </>
  );
};

export default SelectOptions;
