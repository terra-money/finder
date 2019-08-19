import { ReactNode, useContext } from "react";
import FetchError from "../components/FetchError";
import useFetch from "../hooks/useFetch";
import NetworkContext from "../contexts/NetworkContext";

interface IFetchProps {
  url: string;
  params?: object;
}
type Props = IFetchProps & { loading?: ReactNode; children: Function };
const WithFetch = ({ url, params, loading, children }: Props) => {
  const { network } = useContext(NetworkContext);

  const { data, isLoading, error } = useFetch({ url, params, network });

  return error
    ? FetchError({ url, error })
    : isLoading
    ? loading || null
    : children(data);
};

export default WithFetch;
