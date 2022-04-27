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
import { getAmount, getTxFee } from "./Txs";

interface CSV {
  timestamp: string;
  address: string;
  txHash: string;
  currency: string;
  amount: number;
}

interface Params {
  offset: number | undefined;
  limit: number | undefined;
  account: string | undefined;
}

const csvHeaders = [
  { label: "Timestamp", key: "timestamp" },
  { label: "Address", key: "address" },
  { label: "Transaction Hash", key: "txhash" },
  { label: "Fee Amount", key: "feeAmount" },
  { label: "Fee Currency", key: "feeCurrency" },
  { label: "Currency Symbol", key: "currency" },
  { label: "Amount", key: "amount" }
];

const getCSVFilename = (address: string) => {
  const timestamp = new Date();
  return `report-${address}-${
    timestamp.getMonth() + 1
  }-${timestamp.getDate()}-${timestamp.getFullYear()}.csv`;
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

    if (!isSuccess) return null;

    // Do not include in CSV if not success
    const [amountIn, amountOut] = getAmount(address, matchedMsg);
    const rows = new Array(amountIn.length + amountOut.length);

    // Fee
    const fee = getTxFee(txBody?.value?.fee?.amount?.[0]);
    const feeData = fee?.split(" ");

    const feeAmount = feeData ? feeData[0] : "";
    const feeCurrency = feeData ? feeData[1] : "";

    // TX data that is the same for both amounts in and amounts out
    const baseTxData = {
      timestamp,
      address,
      txhash,
      feeAmount,
      feeCurrency
    };

    amountIn.forEach(amountData => {
      const { denom, amount } = amountData.props;
      const tokenDecimals = whitelist?.[denom]?.decimals;

      rows.push({
        ...baseTxData,
        currency: renderDenom(denom, whitelist, contracts),
        amount: format.amount(amount, tokenDecimals) // amount in is positive (received)
      });
    });

    amountOut.forEach(amountData => {
      const { denom, amount } = amountData.props;
      const tokenDecimals = whitelist?.[denom]?.decimals;

      rows.push({
        ...baseTxData,
        currency: renderDenom(denom, whitelist, contracts),
        amount: `-${format.amount(amount, tokenDecimals)}` // amount in is negative (spent)
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
