import http from "../api/http";
import useSWR from "swr";

const fetcher = async (url) => await http.get(url);

export default function useGetActionList() {
  const { data, error, mutate } = useSWR(`/action/get/list`, fetcher);
  return {
    actionList: data?.data,
    actionListError: error,
    actionListMutate: mutate,
  };
}
