import {
  useContracts,
  useNFTContracts,
  useWhitelist
} from "../../hooks/useTerraAssets";
import WithFetch from "../../HOCs/WithFetch";
import Loading from "../../components/Loading";
import Image from "../../components/Image";
import s from "./ContractInfo.module.scss";

const ContractInfo = ({ address }: { address: string }) => {
  const token = useWhitelist()?.[address];
  const nft = useNFTContracts()?.[address];
  const contract = useContracts()?.[address];

  const whitelist = token || contract || nft;
  const icon = whitelist?.icon;

  return (
    <WithFetch
      url={`/wasm/contracts/${address}/store?query_msg={"token_info":{}}`}
      loading={<Loading />}
      renderError={() => null}
      lcd
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
