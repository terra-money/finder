import { useQuery } from "react-query";
import apiClient from "../apiClient";
import { useCurrentChain, useFCDURL } from "../contexts/ChainsContext";

/* hook */
const useRequest = <T>({ url, params }: FetchProps) => {
  const { chainID } = useCurrentChain();
  const fcdURL = useFCDURL();
  const result = useQuery(["fetch", url, params, chainID], async () => {
    const { data } = await apiClient.get<T>(fcdURL + url, { params });
    return data;
  });

  return result;
};

export default useRequest;
