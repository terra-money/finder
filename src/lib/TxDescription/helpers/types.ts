import { LCDClientConfig } from "@terra-money/terra.js";

export interface ComponentProps {
  network: NetworkConfig;
  config?: { showAllCoins?: boolean; myWallet?: string };
}

export interface NetworkConfig extends LCDClientConfig {
  name: string;
}
