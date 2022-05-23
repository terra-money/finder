import { useCurrentChain, useFCDURL } from "../contexts/ChainsContext";
import useRequest from "./useRequest";

const useFCD = <T>(
  url: string,
  offset?: number,
  limit?: number,
  address?: string
) => {
  const params = { offset, limit: limit, account: address };
  const { name } = useCurrentChain();
  const fcdURL = useFCDURL();
  const queryURL = name === "localterra" ? "http://localhost:3060" : fcdURL;
  return useRequest<T>({ url: queryURL + url, params });
};

export default useFCD;
