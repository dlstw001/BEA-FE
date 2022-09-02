import http from '../api/http';
import useSWR from 'swr';
import { useRouter } from 'next/router';

const fetcher = async (url) => await http.get(url);

export default function useGetRoleUserList() {
	const router = useRouter();
	let roleName;
	if (router.isReady) {
		roleName = router.query.rolename;
	}
	const { data, error, mutate } = useSWR(`/role?name=${roleName}`, fetcher);
	return {
		roleUserList: data?.data[0]?.users,
		roleUserListError: error,
		roleUserListmutate: mutate,
	};
}
