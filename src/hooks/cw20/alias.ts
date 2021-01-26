import { gql } from "@apollo/client";

interface Item {
  contract: string;
  category: string;
  msg: object;
}

const stringify = (msg: object) => JSON.stringify(msg).replace(/"/g, '\\"');

const aliasItem = ({ contract, msg, category }: Item) => {
  if (category !== "cw20Token") return;

  return `
    ${contract}: WasmContractsContractAddressStore(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`;
};

const alias = (list: Item[]) => gql`
  query {
    ${list.map(aliasItem)}
  }
`;

export default alias;
