import { useFCDURL } from "../contexts/ChainsContext";
import useRequest from "./useRequest";

const useFCD = <T>(
  url: string,
  offset?: number,
  limit?: number,
  address?: string
) => {
  const params = { offset, limit: limit, account: address };
  const fcdURL = useFCDURL();
  return useRequest<T>({ url: fcdURL + url, params });
};

export default useFCD;
