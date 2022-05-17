import useRequest from "./useRequest";

const useFCD = <T>(
  url: string,
  offset?: number,
  limit?: number,
  address?: string
) => {
  const params = { offset, limit: limit, account: address };
  return useRequest<T>({ url, params: params });
};

export default useFCD;
