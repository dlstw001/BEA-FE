import http from "../api/http";
import useSWR from "swr";

const fetcher = async (url) => await http.get(url);

export default function useGetSystemActionList(systemName) {
  const { data, error, mutate } = useSWR(
    `/system/get/action?name=${systemName}`,
    fetcher,
  );
  return {
    actionList: data?.actions,
    actionListError: error,
    actionListMutate: mutate,
  };
}
