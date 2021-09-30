interface BlockHeader {
  height: string;
  time: string;
  proposer_address: string;
  last_commit_hash: string;
  last_block_id: {
    hash: string;
  };
}

interface OldBlock {
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

interface Block {
  chainId: string;
  height: number;
  timestamp: string;
  proposer: {
    moniker: string;
    operatorAddress: string;
  };
  txs: TxResponse[];
}
