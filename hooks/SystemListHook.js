import http from "../api/http";
import useSWR from "swr";

const fetcher = async (url) => await http.get(url);

export default function useGetSystemList() {
  const { data, error, mutate } = useSWR(`/system/get/list`, fetcher);
  return {
    systemList: data?.data,
    systemListError: error,
    systemListMutate: mutate,
  };
}
