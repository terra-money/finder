import { useState, useEffect } from "react";
import apiClient from "../apiClient";
import { useFCDURL } from "../contexts/ChainsContext";

const useFetch = ({
  url,
  params,
  network
}: FetchProps & { network: string }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const fcdURL = useFCDURL();

  const init = (): void => {
    setError(undefined);
    setIsLoading(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      init();

      try {
        const result = await apiClient.get(fcdURL + url, { params });

        if (result.data === null) {
          throw new Error("Data is null");
        }

        setData(result.data);
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [params, url, network, fcdURL]);

  return { data, isLoading, error };
};

export default useFetch;
