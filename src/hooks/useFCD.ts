import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { useNetwork } from "../HOCs/WithFetch";
import { fcdUrl } from "../scripts/utility";

const useFCD = <T>(
  url: string,
  offset?: number,
  limit?: number,
  address?: string
): { data: T | undefined; isLoading: boolean } => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);
  const network = useNetwork();

  const init = (): void => {
    setIsLoading(true);
  };
  const fcd = fcdUrl(network);
  useEffect(() => {
    const fetchData = async () => {
      init();
      const params = { offset, limit: limit, account: address };

      try {
        const result = await apiClient.get(fcd + url, { params: params });

        if (result.data === null) {
          throw new Error("Data is null");
        }

        setData(result.data);
      } catch {}
      setIsLoading(false);
    };
    fetchData();
  }, [url, network, fcd, address, offset, limit]);

  return { data, isLoading };
};

export default useFCD;
