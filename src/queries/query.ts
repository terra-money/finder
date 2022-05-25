import { useCurrentChain, useFCDURL } from "../contexts/ChainsContext";
import { LOCALTERRA_FCD_URL } from "../scripts/utility";

export const RefetchOptions = {
  DEFAULT: /* onMount, onFocus */ {},
  INFINITY: { staleTime: Infinity, retry: false, refetchOnWindowFocus: false }
};

const LAZY_LIMIT = 999;

/* params */
export const Pagination = {
  "pagination.limit": String(LAZY_LIMIT)
};

export const useGetQueryURL = (url: string) => {
  const { chainID } = useCurrentChain();
  const fcdURL = useFCDURL();
  const queryURL =
    chainID === "localterra" && url.startsWith("/v1")
      ? LOCALTERRA_FCD_URL
      : fcdURL;

  return queryURL + url;
};
