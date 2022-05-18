import { useQuery } from "react-query";
import apiClient from "../apiClient";
import { useCurrentChain } from "../contexts/ChainsContext";

/* hook */
const useRequest = <T>({ url, params }: FetchProps) => {
  const { chainID } = useCurrentChain();
  const result = useQuery(["fetch", url, params, chainID], async () => {
    const { data } = await apiClient.get<T>(url, { params });
    return data;
  });

  return result;
};

export default useRequest;
