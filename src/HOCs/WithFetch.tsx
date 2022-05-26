import React, { ReactNode } from "react";
import FetchError from "../components/FetchError";
import useLCDClient from "../hooks/useLCD";
import useRequest from "../hooks/useRequest";
import { useGetQueryURL } from "../queries/query";

type Props = FetchProps & {
  loading?: ReactNode;
  renderError?: () => ReactNode;
  lcd?: boolean;
  children: ReactNode | ((data: any) => ReactNode);
};

const WithFetch = (props: Props) => {
  const { url, params, loading, renderError, children, lcd } = props;
  const queryURL = useGetQueryURL(url);
  const { config } = useLCDClient();
  const { data, isLoading, isError } = useRequest({
    url: lcd ? config.URL + url : queryURL,
    params
  });

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
