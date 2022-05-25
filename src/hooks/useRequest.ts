import { useQuery } from "react-query";
import apiClient from "../apiClient";
import { useCurrentChain } from "../contexts/ChainsContext";

interface Props extends FetchProps {
  enabled?: boolean;
}

/* hook */
const useRequest = <T>({ url, params, enabled }: Props) => {
  const { chainID } = useCurrentChain();
  const result = useQuery(
    ["fetch", url, params, chainID, enabled],
    async () => {
      const { data } = await apiClient.get<T>(url, { params });
      return data;
    },
    { enabled }
  );

  return result;
};

export default useRequest;
