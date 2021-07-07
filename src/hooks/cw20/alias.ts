import { gql } from "@apollo/client";

interface Item {
  contract: string;
  msg: object;
}

const stringify = (msg: object) => JSON.stringify(msg).replace(/"/g, '\\"');

const aliasItem = ({ contract, msg }: Item) =>
  `
    ${contract}: WasmContractsContractAddressStore(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`;

const alias = (list: Item[]) => gql`
  query {
    ${list.map(aliasItem)}
  }
`;

export default alias;
