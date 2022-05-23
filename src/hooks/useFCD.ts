import { useGetQueryURL } from "../queries/query";
import useRequest from "./useRequest";

const useFCD = <T>(
  url: string,
  offset?: number,
  limit?: number,
  address?: string
) => {
  const params = { offset, limit: limit, account: address };
  const queryURL = useGetQueryURL(url);
  return useRequest<T>({ url: queryURL, params });
};

export default useFCD;
