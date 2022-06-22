import { gql } from "@apollo/client";

interface Item {
  address: string;
  contract: string;
  msg: object;
  isClassic?: boolean;
}

const stringify = (msg: object) => JSON.stringify(msg).replace(/"/g, '\\"');

const aliasItem = ({ contract, msg, isClassic, address }: Item) =>
  isClassic
    ? `
    ${contract}: WasmContractsContractAddressStore(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`
    : `${contract}: wasm{
      contractQuery( 
        contractAddress: "${contract}"
        query: {
          balance: {
            address: "${address}"
          }
        }
      )
    }`;

const alias = (list: Item[]) => gql`
  query {
    ${list.map(aliasItem)}
  }
`;

export default alias;
