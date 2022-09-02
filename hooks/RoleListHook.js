import http from '../api/http';
import useSWR from 'swr';

const fetcher = async (url) => await http.get(url);

export default function useGetRoleList() {
	const { data, error, mutate } = useSWR(`/role/get/list`, fetcher);
	return {
		roleList: data?.data,
		roleListError: error,
		roleListMutate: mutate,
	};
}
