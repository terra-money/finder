import { useIsClassic } from "../contexts/ChainsContext";
import useDenomTrace from "../hooks/useDenomTrace";
import format from "../scripts/format";
import s from "./Denom.module.scss";

const Denom = ({ denom }: { denom: string }) => {
  const isClassic = useIsClassic();
  const ibc = useDenomTrace(denom);
  const render = ibc
    ? format.denom(ibc.base_denom)
    : format.denom(denom, isClassic);
  const path = ibc?.path?.split("/");

  return (
    <>
      {render}{" "}
      {path && <span className={s.ibc}>({path[path.length - 1]})</span>}
    </>
  );
};

export default Denom;
