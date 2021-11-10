import React, { ReactNode } from "react";
import FetchError from "../components/FetchError";
import { useCurrentChain } from "../contexts/ChainsContext";
import useFetch from "../hooks/useFetch";

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
export const useRequest = ({ url, params }: FetchProps) => {
  const { chainID } = useCurrentChain();
  const result = useFetch({ url, params, network: chainID });
  return result;
};
