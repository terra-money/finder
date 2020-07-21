import React, { ReactNode, useContext } from "react";
import FetchError from "../components/FetchError";
import useFetch from "../hooks/useFetch";
import NetworkContext from "../contexts/NetworkContext";

type Props = FetchProps & {
  loading?: ReactNode;
  children: (data: any) => ReactNode;
};

const WithFetch = ({ url, params, loading, children }: Props) => {
  const { data, isLoading, error } = useRequest({ url, params });

  return (
    <>
      {error
        ? FetchError({ url, error })
        : isLoading
        ? loading || null
        : children(data) || null}
    </>
  );
};

export default WithFetch;

/* hook */
export const useNetwork = () => {
  const { network } = useContext(NetworkContext);
  return network;
};

export const useRequest = ({ url, params }: FetchProps) => {
  const network = useNetwork();
  const result = useFetch({ url, params, network });
  return result;
};
