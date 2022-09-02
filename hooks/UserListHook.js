import http from "../api/http";
import useSWR from "swr";

const fetcher = async (url) => await http.get(url);

export default function useGetUserList() {
  const { data, error, mutate } = useSWR(`/user/get/list`, fetcher);
  return {
    userList: data?.data,
    userListError: error,
    userListMutate: mutate,
  };
}
