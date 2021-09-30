interface BlockHeader {
  height: string;
  time: string;
  proposer_address: string;
  last_commit_hash: string;
  last_block_id: {
    hash: string;
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
