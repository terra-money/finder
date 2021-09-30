import React, { useContext } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import TxList from "../Txs";
import c from "classnames";
import s from "./Block.module.scss";

import Loading from "../../components/Loading";
import WithFetch from "../../HOCs/WithFetch";
import { fromISOTime } from "../../scripts/utility";
import networkContext from "../../contexts/NetworkContext";
import Finder from "../../components/Finder";

const heightButton = (height: number) => (
  <span className={s.height}>
    <span>{height}</span>
    <Link to={`${height - 1}`}>
      <i className="material-icons">chevron_left</i>
    </Link>
    <Link to={`${height + 1}`}>
      <i className="material-icons">chevron_right</i>
    </Link>
  </span>
);

const txsCount = (txCount: number) => (
  <span className={s.txs}>
    {txCount > 0 ? (
      <span>{txCount} Transactions</span>
    ) : (
      <span>0 Transactions</span>
    )}
  </span>
);

const Block = (
  props: RouteComponentProps<{ height: string; network: string }>
) => {
  const { match } = props;
  const { height } = match.params;
  const { network } = useContext(networkContext);

  return (
    <WithFetch
      url={`/v1/blocks/${height}?chainId=${network}`}
      loading={<Loading />}
    >
      {(blockData: Block) => (
        <>
          <h2 className="title">
            Block<span>#{height}</span>
          </h2>
          <div className={c(s.list, s.blockInfo)}>
            <div className={s.row}>
              <div className={s.head}>Chain ID</div>
              <div className={s.body}>{blockData.chainId}</div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Block height</div>
              <div className={s.body}>{heightButton(blockData.height)}</div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Timestamp</div>
              <div className={s.body}>{fromISOTime(blockData.timestamp)}</div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Transactions</div>
              <div className={s.body}>{txsCount(blockData.txs.length)}</div>
            </div>
            <div className={s.row}>
              <div className={s.head}>Proposer</div>
              <div className={s.body}>
                <Finder q={"validator"} v={blockData.proposer.operatorAddress}>
                  {blockData.proposer.moniker}
                </Finder>
              </div>
            </div>
          </div>

          <TxList txs={blockData.txs} />
        </>
      )}
    </WithFetch>
  );
};

export default Block;
