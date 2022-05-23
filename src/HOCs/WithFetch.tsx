import React, { ReactNode } from "react";
import FetchError from "../components/FetchError";
import { useCurrentChain, useFCDURL } from "../contexts/ChainsContext";
import useRequest from "../hooks/useRequest";

type Props = FetchProps & {
  loading?: ReactNode;
  renderError?: () => ReactNode;
  children: ReactNode | ((data: any) => ReactNode);
};

const WithFetch = (props: Props) => {
  const { url, params, loading, renderError, children } = props;
  const fcdURL = useFCDURL();
  const { name } = useCurrentChain();

  const queryURL =
    name === "localterra" && url.startsWith("/v1")
      ? "http://localhost:3060"
      : fcdURL;

  const { data, isLoading, isError } = useRequest({
    url: queryURL + url,
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
