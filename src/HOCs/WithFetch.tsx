import React, { ReactNode, useContext } from "react";
import FetchError from "../components/FetchError";
import useFetch from "../hooks/useFetch";
import NetworkContext from "../contexts/NetworkContext";

type Props = FetchProps & {
  loading?: ReactNode;
  renderError?: () => ReactNode;
  children: ReactNode | ((data: any) => ReactNode);
};

const WithFetch = (props: Props) => {
  const { url, params, loading, renderError, children } = props;
  const { data, isLoading, error } = useRequest({ url, params });
  const render = () =>
    typeof children === "function" ? children(data) : children;

  return (
    <>
      {error
        ? renderError
          ? renderError()
          : FetchError({ url, error })
        : isLoading
        ? loading || null
        : render() || null}
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
