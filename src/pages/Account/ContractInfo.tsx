import { useRecoilValue } from "recoil";
import { Whitelist } from "../../store/WhitelistStore";
import { Contracts } from "../../store/ContractStore";
import WithFetch from "../../HOCs/WithFetch";
import Loading from "../../components/Loading";
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
    <WithFetch
      url={`/wasm/contracts/${address}/store?query_msg={"token_info":{}}`}
      loading={<Loading />}
      renderError={() => null}
    >
      {({ result: { name, symbol } }) => (
        <section className={s.wrapper}>
          <span className={s.name}>
            {name}
            <span className={s.vertical} />
            <span className={s.symbol}>{symbol}</span>
          </span>
        </section>
      )}
    </WithFetch>
  );
};

export default ContractInfo;
