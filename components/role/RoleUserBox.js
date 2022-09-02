import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

//MUI Components
import { TextField, Autocomplete, Chip } from '@mui/material';

//Data Fetching
import http from '../../api/http';
import useGetUserList from '../../hooks/UserListHook';
import useGetRoleUserList from '../../hooks/RoleUserListHook';

export default function RoleUserBox() {
	const router = useRouter();
	const roleName = router.query.rolename;
	const roleId = router.query.id;

	const { userList, userListError } = useGetUserList();
	const { roleUserList, roleUserListError } = useGetRoleUserList(roleName);

	const [fixedOptions, setFixedOptions] = useState([]);
	const [value, setValue] = useState([]);

	//Generate Fixed Options
	const handleSetFixedOption = () => {
		let list = userList?.filter((user) => roleUserList?.includes(user.id));
		setValue([...fixedOptions, ...list]);
	};

	//Update Role User List
	const handleUpdateRoleUserList = async (list) => {
		try {
			const res = await http.put(`${process.env.NEXT_PUBLIC_BASE_URL}/role/update/users`, {
				roleId: roleId,
				userList: list,
			});
			console.log(res);
			if (res.statusCode != 200) {
				alert('Update user fail, please refresh and try again');
			}
		} catch (error) {
			alert('Update user fail, please refresh and try again');
		}
	};

	//Set fixed option for current user
	useEffect(() => {
		if (userList && roleUserList) {
			handleSetFixedOption();
		}
	}, [userList, roleUserList]);

	return (
		<Autocomplete
			multiple
			id='fixed-tags-demo'
			value={value}
			onChange={(event, newValue) => {
				handleUpdateRoleUserList(newValue);
				setValue([...fixedOptions, ...newValue.filter((option) => fixedOptions.indexOf(option) === -1)]);
			}}
			options={userList || []}
			getOptionLabel={(option) => option.email}
			renderTags={(tagValue, getTagProps) =>
				tagValue.map((option, index) => (
					<Chip key={index} label={option.email} {...getTagProps({ index })} disabled={fixedOptions.indexOf(option) !== -1} />
				))
			}
			renderInput={(params) => <TextField {...params} label='Users' placeholder='Emails' />}
		/>
	);
}
