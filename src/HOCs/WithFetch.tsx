import React, { ReactNode } from "react";
import FetchError from "../components/FetchError";
import useRequest from "../hooks/useRequest";
import { useGetQueryURL } from "../queries/query";

type Props = FetchProps & {
  loading?: ReactNode;
  renderError?: () => ReactNode;
  children: ReactNode | ((data: any) => ReactNode);
};

const WithFetch = (props: Props) => {
  const { url, params, loading, renderError, children } = props;
  const queryURL = useGetQueryURL(url);
  const { data, isLoading, isError } = useRequest({ url: queryURL, params });

  const render = () =>
    typeof children === "function" ? children(data) : children;

  return (
    <>
      {isError
        ? renderError
          ? renderError()
          : FetchError({ url })
        : isLoading
        ? loading || null
        : render() || null}
    </>
  );
};

export default WithFetch;
