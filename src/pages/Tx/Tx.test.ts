import { getTotalTax } from "./Tx";
import sample from "./logs.sample.json";

const dummyTx: TxResponse = {
  id: 11,
  height: "1234",
  txhash: "",
  raw_log: "",
  logs: [],
  gas_wanted: "12345",
  gas_used: "12345",
  tags: [],
  tx: {
    type: "test",
    value: {
      msg: [],
      fee: { amount: [], gas: "12345" },
      signatures: [],
      memo: ""
    }
  },
  timestamp: new Date()
};

describe("getTotalTax", () => {
  test(`no tax`, () => {
    // 3D65E73CF9C401A8736AE1A52AF357EEFD92AA4732B33D3C9BBA35D5F655203F
    expect(getTotalTax({ ...dummyTx, logs: sample["no tax"].logs })).toEqual(
      "0 Luna"
    );
  });

  test(`single denom`, () => {
    // 3A7404734CC35717564F6C97FF68634C49980B5608D7E3FAF13BBF3A99366E5F
    expect(
      getTotalTax({ ...dummyTx, logs: sample["single denom"].logs })
    ).toEqual(`308.477000 KRT`);
  });

  test(`multiple logs with single denom`, () => {
    // https://soju-0008-lcd.terra.dev/txs/56C26BA597940A5485BA572F7F544538512C9C66560E2E607573CB09D5F79BB0
    expect(
      getTotalTax({
        ...dummyTx,
        logs: sample["multiple logs with single denom"].logs
      })
    ).toEqual(`0.000040 KRT`);
  });

  test(`multiple logs with multiple denoms`, () => {
    expect(
      getTotalTax({
        ...dummyTx,
        logs: sample["multiple logs with multiple denoms"].logs
      })
    ).toEqual(`0.000040 KRT, 0.000020 Luna, 0.000020 UST`);
  });
});
