import { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  LogFinderAmountResult,
  getTxAmounts,
  createLogMatcherForAmounts
} from "@terra-money/log-finder-ruleset";
import format from "../../scripts/format";
import { LogfinderAmountRuleSet } from "../../store/LogfinderRuleSetStore";
import s from "./CSVExport.module.scss";
import { CSVLink } from "react-csv";
import { Tokens } from "../../hooks/cw20/useTokenBalance";
import { Whitelist } from "../../store/WhitelistStore";
import { Contracts } from "../../store/ContractStore";
import { Contract, renderDenom } from "../../components/Amount";
import { useFCDURL } from "../../contexts/ChainsContext";
import apiClient from "../../apiClient";
import { getTxFee } from "./Txs";
import {
  splitCoinData,
  sliceMsgType,
  fromISOTime
} from "../../scripts/utility";
import { plus } from "../../scripts/math";

interface CSV {
  timestamp: string;
  txHash: string;
  trackedAddress: string;
  txType: string;
  sender: string;
  recipient: string;
  amount: string;
  currency: string;
  feeAmount: string;
  feeCurrency: string;
}

interface Params {
  offset: number | undefined;
  limit: number | undefined;
  account: string | undefined;
}

interface Amount {
  amount: string;
  denom: string;
}

// Defines the order of columns in CSV
const csvHeaders = [
  { label: "Timestamp", key: "timestamp" },
  { label: "Transaction Hash", key: "txHash" },
  { label: "Tracked Address", key: "trackedAddress" },
  { label: "Transaction Type", key: "txType" },
  { label: "Sender", key: "sender" },
  { label: "Recipient", key: "recipient" },
  { label: "Amount", key: "amount" },
  { label: "Currency", key: "currency" },
  { label: "Fee Amount", key: "feeAmount" },
  { label: "Fee Currency", key: "feeCurrency" }
];

const getCSVFilename = (address: string) => {
  const timestamp = new Date();
  return `report-${address}-${
    timestamp.getMonth() + 1
  }-${timestamp.getDate()}-${timestamp.getFullYear()}.csv`;
};

const concatAmounts = (
  amountList: string[] | undefined,
  amountArray: Amount[]
) => {
  amountList?.forEach(amount => {
    const coin = splitCoinData(amount.trim());
    if (coin) {
      const { amount, denom } = coin;
      amountArray.push({
        amount,
        denom
      });
    }
  });
};

const processMultiSend = (
  matchedLogs: LogFinderAmountResult[],
  address: string,
  amountIn: Amount[],
  amountOut: Amount[],
  txTypesIn: string[],
  txTypesOut: string[],
  sendersIn: string[],
  sendersOut: string[],
  recipientsIn: string[],
  recipientsOut: string[]
) => {
  const amountInMap = new Map<string, string>();
  const amountOutMap = new Map<string, string>();

  matchedLogs.forEach(log => {
    const recipient = log.match[0].value;
    const coin = log.match[1].value.split(",").map(splitCoinData);

    coin.forEach(data => {
      if (data) {
        const { amount, denom } = data;
        const amountInStack = amountInMap.get(denom);
        const amountOutStack = amountOutMap.get(denom);

        const inStack = amountInStack ? plus(amountInStack, amount) : amount;
        const outStack = amountOutStack ? plus(amountOutStack, amount) : amount;

        if (recipient === address) {
          amountInMap.set(denom, inStack);
        } else {
          amountOutMap.set(denom, outStack);
        }
      }
    });
  });

  amountInMap.forEach((amount, denom) => {
    amountIn.push({
      amount,
      denom
    });
    txTypesIn.push("multiSend");
    // just push empty values as not sure how to process this correctly
    sendersIn.push("");
    recipientsIn.push("");
  });

  amountOutMap.forEach((amount, denom) => {
    amountOut.push({
      amount,
      denom
    });
    txTypesOut.push("multiSend");
    sendersOut.push("");
    recipientsOut.push("");
  });
};

const getTxInfo = (address: string, matchedMsg?: LogFinderAmountResult[][]) => {
  const amountsIn: Amount[] = [];
  const amountsOut: Amount[] = [];
  let txTypesIn: string[] = [];
  let txTypesOut: string[] = [];
  let sendersIn: string[] = [];
  let sendersOut: string[] = [];
  let recipientsIn: string[] = [];
  let recipientsOut: string[] = [];

  matchedMsg?.forEach(matchedLog => {
    if (matchedLog && matchedLog[0]?.transformed?.type === "multiSend") {
      processMultiSend(
        matchedLog,
        address,
        amountsIn,
        amountsOut,
        txTypesIn,
        txTypesOut,
        sendersIn,
        sendersOut,
        recipientsIn,
        recipientsOut
      );
    } else {
      matchedLog?.forEach(log => {
        const txType = log.transformed?.type;
        const amounts = log.transformed?.amount?.split(",");
        const sender = log.transformed?.sender;
        const recipient = log.transformed?.recipient;

        if (address === sender) {
          concatAmounts(amounts, amountsOut);
          // We want the recipientsOut, sendersOut, etc. arrays to have the same length as amounts so it matches while rendering csv
          recipientsOut = recipientsOut.concat(
            Array(amountsOut.length).fill(recipient)
          );
          sendersOut = sendersOut.concat(Array(amountsOut.length).fill(sender));
          txTypesOut = txTypesOut.concat(Array(amountsOut.length).fill(txType));
        }

        if (address === recipient) {
          concatAmounts(amounts, amountsIn);
          recipientsIn = recipientsIn.concat(
            Array(amountsIn.length).fill(recipient)
          );
          sendersIn = sendersIn.concat(Array(amountsIn.length).fill(sender));
          txTypesIn = txTypesIn.concat(Array(amountsIn.length).fill(txType));
        }
      });
    }
  });

  return {
    amountsIn,
    amountsOut,
    txTypesIn,
    txTypesOut,
    sendersIn,
    sendersOut,
    recipientsIn,
    recipientsOut
  };
};

const CsvExport = ({ address }: { address: string }) => {
  const whitelist: Tokens = useRecoilValue(Whitelist);
  const contracts: Contract = useRecoilValue(Contracts);
  const [txs, setTxs] = useState<TxResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fcdURL = useFCDURL();

  // fetch all transactions for a given address
  const fetchTxs = async (address: string) => {
    if (!loading) {
      setLoading(true);
      setError(false);
      setTxs([]);

      const limit = 100; // Either 100 or 10
      let offset: number | undefined = 0;
      let allTxs: TxResponse[] = [];
      let fetchNext = true;

      // fetch all transactions until some next transactions are available
      while (fetchNext) {
        const params: Params = { offset, limit, account: address };
        try {
          const result = await apiClient.get(fcdURL + "/v1/txs", {
            params: params
          });

          if (result.data === null) {
            setError(true);
            fetchNext = false;
          } else {
            allTxs = allTxs.concat(result.data.txs);
            offset = result.data.next;
            fetchNext = offset ? true : false;
          }
        } catch {
          setError(true);
          fetchNext = false;
        }
      }

      if (!error) {
        setTxs(allTxs);
      }
      setLoading(false);
    }
  };

  const ruleArray = useRecoilValue(LogfinderAmountRuleSet);
  const logMatcher = useMemo(
    () => createLogMatcherForAmounts(ruleArray),
    [ruleArray]
  );

  const getCsvRow = (
    response: TxResponse,
    address: string,
    matchedMsg?: LogFinderAmountResult[][]
  ): CSV[] | null => {
    const { tx: txBody, txhash, timestamp } = response;
    const isSuccess = !response.code;

    // Don't include unsuccessful transactions in CSV
    if (!isSuccess) return null;

    const {
      amountsIn,
      amountsOut,
      txTypesIn,
      txTypesOut,
      sendersIn,
      sendersOut,
      recipientsIn,
      recipientsOut
    } = getTxInfo(address, matchedMsg);

    // Fee
    const fee = getTxFee(txBody?.value?.fee?.amount?.[0]);
    const feeData = fee?.split(" ");

    const feeAmount = feeData ? feeData[0] : "";
    const feeCurrency = feeData ? feeData[1] : "";

    // TX data that is the same for both amounts in and amounts out
    const baseTxData = {
      timestamp: fromISOTime(timestamp.toString()),
      trackedAddress: address,
      txHash: txhash,
      feeAmount,
      feeCurrency
    };

    const rows: CSV[] = [];

    if (amountsIn.length === 0 && amountsOut.length === 0) {
      // For example MsgVote does not transfer any value. Sometimes also MsgExecuteContract
      const msg = sliceMsgType(txBody.value.msg[0].type);
      rows.push({
        ...baseTxData,
        currency: "",
        amount: "0",
        txType: msg,
        sender: "",
        recipient: ""
      });
    }

    // Loop over amountsOut and amountsIn and add a new row for every single currency amount
    amountsIn.forEach((amountData, i) => {
      const { denom, amount } = amountData;
      const tokenDecimals = whitelist?.[denom]?.decimals;

      rows.push({
        ...baseTxData,
        currency: renderDenom(denom, whitelist, contracts),
        amount: format.amount(amount, tokenDecimals), // amount in is positive (received)
        txType: txTypesIn[i],
        sender: sendersIn[i],
        recipient: recipientsIn[i]
      });
    });

    amountsOut.forEach((amountData, i) => {
      const { denom, amount } = amountData;
      const tokenDecimals = whitelist?.[denom]?.decimals;

      rows.push({
        ...baseTxData,
        currency: renderDenom(denom, whitelist, contracts),
        amount: `-${format.amount(amount, tokenDecimals)}`, // amount in is negative (spent)
        txType: txTypesOut[i],
        sender: sendersOut[i],
        recipient: recipientsOut[i]
      });
    });

    return rows;
  };

  const processTxsForCSV = (txs: TxResponse[], address: string) => {
    const data = new Array<CSV>();

    txs.forEach(tx => {
      const matchedLogs = getTxAmounts(JSON.stringify(tx), logMatcher, address);
      const rowsForSingleTx = getCsvRow(tx, address, matchedLogs);
      if (rowsForSingleTx) {
        rowsForSingleTx.forEach(row => {
          data.push(row);
        });
      }
    });

    return data;
  };

  return (
    <>
      {loading ? (
        <span className={s.loading}>loading...</span>
      ) : txs.length ? (
        <CSVLink
          className={s.exportCsvButton}
          data={processTxsForCSV(txs, address)}
          headers={csvHeaders}
          filename={getCSVFilename(address)}
        >
          Download CSV
        </CSVLink>
      ) : (
        <button className={s.exportCsvButton} onClick={() => fetchTxs(address)}>
          Request CSV Report
        </button>
      )}
      {error && !loading && (
        <span className={s.error}>(Something went wrong...)</span>
      )}
    </>
  );
};

export default CsvExport;
