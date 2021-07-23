import { useRecoilValue } from "recoil";
import { Whitelist } from "../../store/WhitelistStore";
import { Contracts } from "../../store/ContractStore";
import s from "./ContractInfo.module.scss";

const ContractInfo = ({ address }: { address: string }) => {
  const token = useRecoilValue(Whitelist)[address];
  const contract = useRecoilValue(Contracts)[address];

  return token || contract ? (
    <section className={s.wrapper}>
      <img
        src={token?.icon || contract?.icon}
        alt={token?.symbol || contract?.name}
        className={s.icon}
      />
      {token ? (
        <span className={s.name}>
          {`${token.protocol} ${token.symbol} Token `}
          <span className={s.vertical} />
          <span className={s.symbol}>{token.symbol}</span>
        </span>
      ) : (
        <span className={s.name}>
          {contract.protocol} {contract.name}
        </span>
      )}
    </section>
  ) : (
    <></>
  );
};

export default ContractInfo;
