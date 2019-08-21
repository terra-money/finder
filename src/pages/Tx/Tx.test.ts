import { parseLogs } from "./Tx";
import sample from "./logs.sample.json";

describe("parseLogs", () => {
  test(`no_tax`, () => {
    // 3D65E73CF9C401A8736AE1A52AF357EEFD92AA4732B33D3C9BBA35D5F655203F
    expect(parseLogs(sample["no_tax"].logs)).toEqual(``);
  });
  test(`krw_tax`, () => {
    // 3A7404734CC35717564F6C97FF68634C49980B5608D7E3FAF13BBF3A99366E5F
    expect(parseLogs(sample["krw_tax"].logs)).toEqual(`308.477000 KRT`);
  });
  test(`multi_logs_single_denom`, () => {
    // https://soju-0008-lcd.terra.dev/txs/56C26BA597940A5485BA572F7F544538512C9C66560E2E607573CB09D5F79BB0
    expect(parseLogs(sample["multi_logs_single_denom"].logs)).toEqual(
      `0.000040 KRT`
    );
  });
  test(`multi_logs_multi_denoms`, () => {
    expect(parseLogs(sample["multi_logs_multi_denoms"].logs)).toEqual(
      `0.000040 KRT, 0.000020 Luna, 0.000020 UST`
    );
  });
});
