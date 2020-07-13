interface BlockHeader {
  height: string;
  time: string;
  proposer_address: string;
  last_commit_hash: string;
}

interface Block {
  // Before Columbus-3 there was block_meta
  block_meta?: {
    block_id: {
      hash: string;
    };
    header: BlockHeader;
  };
  // Columbus-4 has block_id in first depth
  block_id?: {
    hash: string;
  };
  block: {
    header: BlockHeader;
    data: {
      txs: string[];
    };
  };
}
