import React, { useContext } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import c from "classnames";
import s from "./Block.module.scss";

import Loading from "../../components/Loading";
import WithFetch from "../../HOCs/WithFetch";
import { fromISOTime } from "../../scripts/utility";
import networkContext from "../../contexts/NetworkContext";
const Block = (
  props: RouteComponentProps<{ block: string; network: string }>
) => {
  const { match } = props;
  const { block } = match.params;
  const { network } = useContext(networkContext);
  function Height(block_meta: IBlockMeta) {
    return (
      <span className={s.height}>
        <span>{block_meta.header.height}</span>
        <Link to={`${parseInt(block) - 1}`}>
          <i className="material-icons">chevron_left</i>
        </Link>
        <Link to={`${parseInt(block) + 1}`}>
          <i className="material-icons">chevron_right</i>
        </Link>
      </span>
    );
  }

  function Txs(block_meta: IBlockMeta) {
    return (
      <span className={s.txs}>
        {parseInt(block_meta.header.num_txs) > 0 ? (
          <Link className={s.button} to={`/${network}/txs/${block}`}>
            {block_meta.header.num_txs} Transactions{" "}
            <i className="material-icons"> chevron_right</i>
          </Link>
        ) : (
          <button className={c(s.button, s.none)}>0 Transactions</button>
        )}
      </span>
    );
  }

  function parentHash(block_meta: IBlockMeta) {
    return (
      <Link className={s.button} to={`${parseInt(block) - 1}`}>
        {block_meta.header.last_commit_hash}
      </Link>
    );
  }

  return (
    <WithFetch url={`/blocks/${block}`} loading={<Loading />}>
      {(blockData: IBlock) => (
        <>
          <h2 className="title">
            Block<span>#{block}</span>
          </h2>
          <div className={s.list}>
            <div className={s.row}>
              <div className={s.head}>Block height</div>
              <div className={s.body}>{Height(blockData.block_meta)}</div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Timestamp</div>
              <div className={s.body}>
                {fromISOTime(blockData.block_meta.header.time)} (UTC)
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Transactions</div>
              <div className={s.body}>{Txs(blockData.block_meta)}</div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Proposer</div>
              <div className={s.body}>
                {blockData.block_meta.header.proposer_address}
              </div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Block hash</div>
              <div className={s.body}>{blockData.block_meta.block_id.hash}</div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Parent hash</div>
              <div className={s.body}>{parentHash(blockData.block_meta)}</div>
            </div>
          </div>
        </>
      )}
    </WithFetch>
  );
};

export default Block;
