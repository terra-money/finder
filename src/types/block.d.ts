interface IBlock {
  block_meta: IBlockMeta;
  block: object;
}

interface IBlockMeta {
  header: {
    height: string;
    time: string;
    total_txs: string;
    proposer_address: string;
    last_commit_hash: string;
    num_txs: string;
  };
  block_id: {
    hash: string;
  };
}
