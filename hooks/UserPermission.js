import http from "../api/http";
import useSWR from "swr";

const fetcher = async (url) => await http.get(url);

export default function useGetUserPermission() {
  let email;
  if (typeof window != "undefined") {
    email = localStorage.getItem("userEmail");
  }
  const { data, error } = useSWR(`/user/get/user?email=${email}`, fetcher, {
    refreshInterval: 3000,
  });
  return {
    userPermission: data?.data,
    userPermissionError: error,
  };
}
