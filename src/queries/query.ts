export const RefetchOptions = {
  DEFAULT: /* onMount, onFocus */ {},
  INFINITY: { staleTime: Infinity, retry: false, refetchOnWindowFocus: false }
};

const LAZY_LIMIT = 999;

/* params */
export const Pagination = {
  "pagination.limit": String(LAZY_LIMIT)
};
