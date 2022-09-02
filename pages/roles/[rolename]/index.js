import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

//MUI Components
import { Box, Checkbox, OutlinedInput, InputLabel, MenuItem, FormControl, ListItemText, Select, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GroupsIcon from '@mui/icons-material/Groups';

//Custom Components
import SearchField from '../../../components/searchfield/SearchField.';
import TableWithPagination from '../../../components/table/TableWithPagination';
import TextButton from '../../../components/button/TextButton';
import CustomButton from '../../../components/button/CustomButton';
import Notification from '../../../components/notification/Notification';

//Data Fetching
import http from '../../../api/http';
import useGetActionList from '../../../hooks/ActionListHook';
import useGetUserList from '../../../hooks/UserListHook';
import useGetRoleUserList from '../../../hooks/RoleUserListHook';

export default function RoleDetails() {
	const router = useRouter();
	const roleName = router.query.rolename;
	const roleId = router.query.id;

	//Button State
	const [removeButtonOpen, setRemoveButtonOpen] = useState(false);
	const [addButtonOpen, setAddButtonOpen] = useState(false);
	const [actionName, setActionName] = useState([]);
	const [open, setOpen] = useState(false);

	//Action Tabel State
	const [actionRows, setActionRows] = useState([]);
	const [actionRowCount, setActionRowCount] = useState(0);
	const [readState, setReadState] = useState([]);
	const [writeState, setWriteState] = useState([]);
	const [selectionModel, setSelectionModel] = useState([]);

	//User Tabel State
	const [userRows, setUserRows] = useState([]);

	//Notification State
	const [addNotification, setAddNotification] = useState(false);
	const [removeNotification, setRemoveNotification] = useState(false);
	const [updateNotification, setUpdateNotification] = useState(false);

	//Data Fetching
	const { actionList, actionListError } = useGetActionList();
	const { userList, userListError, userListMutate } = useGetUserList();
	const { roleUserList, roleUserListError, roleUserListmutate } = useGetRoleUserList();

	//Action Table Column Setting
	const actionColumns = [
		{ field: 'name', headerName: 'Action name', flex: 1 },
		{ field: 'desc', headerName: 'Description', flex: 2 },
		{
			field: 'canRead',
			headerName: 'Read',
			flex: 0.5,
			renderCell: (params) => (
				<Checkbox
					color='primary'
					disabled={writeState[params.row.index]}
					checked={readState[params.row.index]}
					onChange={() => handleReadChange(params.row.index)}
				/>
			),
		},
		{
			field: 'canWrite',
			headerName: 'Write',
			flex: 0.5,
			renderCell: (params) => (
				<Checkbox
					color='primary'
					disabled={readState[params.row.index]}
					checked={writeState[params.row.index]}
					onChange={() => handleWriteChange(params.row.index)}
				/>
			),
		},
	];

	//User Table Column Setting
	const userColumns = [
		{ field: 'name', headerName: 'Name', flex: 1 },
		{ field: 'email', headerName: 'Email', flex: 2 },
		{
			field: 'active',
			headerName: 'Active',
			flex: 1,
			renderCell: (params) => <Checkbox color='primary' checked={roleUserList?.includes(params.id)} onChange={() => handleUserChange(params)} />,
		},
	];

	//Button Setting
	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
				width: 300,
			},
		},
	};

	//Button Function
	const handleRemoveButtonClickOpen = () => {
		setRemoveButtonOpen(true);
	};

	const handleRemoveButtonClose = () => {
		setRemoveButtonOpen(false);
	};

	const handleAddButtonClickOpen = () => {
		setAddButtonOpen(true);
	};

	const handleAddButtonClose = () => {
		setAddButtonOpen(false);
		setActionName([]);
	};

	const handleActionNameChange = (event) => {
		const {
			target: { value },
		} = event;
		setActionName(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value
		);
	};

	//Handle Collapse State
	const handleCollapseChange = () => {
		setOpen(!open);
		setUserRows(userList);
	};

	//Notification Function
	const handleNotificationClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setAddNotification(false);
		setRemoveNotification(false);
		setUpdateNotification(false);
	};

	//Get Action
	const handleGetRoleAction = async () => {
		const res = await http.get(`/role/get/action?name=${roleName}`);
		if (res.statusCode === 200) {
			let rows = res.res;
			rows.map((item, index) => {
				item.index = index;
			});
			setActionRows(rows);
			setActionRowCount(rows.length);
			setReadState(rows.map((action) => action.canRead));
			setWriteState(rows.map((action) => action.canWrite));
		}
	};

	//Add Action
	const handleAddAction = async () => {
		try {
			const newRow = actionList
				.filter((item) => actionName.includes(item.name))
				.map((item) => ({
					action: item.id,
				}));
			let rawRows = [
				...actionRows.map((item) => ({
					action: item.id,
					canRead: item.canRead,
					canWrite: item.canWrite,
				})),
			];
			rawRows.push(...newRow);
			const reqBody = {
				roleId: roleId,
				actionList: rawRows,
			};
			const res = await http.put(`/role/update/actions`, reqBody);
			if (res.statusCode === 200) {
				setAddButtonOpen(false);
				setActionName([]);
				setRemoveNotification(false);
				setUpdateNotification(false);
				setAddNotification(true);
			}
		} catch (e) {
			alert('Error occured, please try again');
		}
	};

	//Remove Action
	const handleRemoveAction = async () => {
		try {
			const data = actionRows
				.filter((item) => !selectionModel.includes(item.id))
				.map((item) => ({
					action: item.id,
					canRead: item.canRead,
					canWrite: item.canWrite,
				}));
			const reqBody = {
				roleId: roleId,
				actionList: data,
			};
			const res = await http.put(`/role/update/actions`, reqBody);
			if (res.statusCode === 200) {
				setAddNotification(false);
				setUpdateNotification(false);
				setRemoveNotification(true);
				setRemoveButtonOpen(false);
			}
		} catch (e) {
			alert('Error, please try again');
		}
	};

	//Update Action Read/Write
	const handleUpdateRoleAction = async (reqBody) => {
		try {
			const res = await http.put(`/role/update/action/readwrite?roleId=${roleId}`, reqBody);
			if (res.statusCode === 200) {
				setAddNotification(false);
				setRemoveNotification(false);
				setUpdateNotification(false);
			}
		} catch (e) {
			alert('Error, please try again');
		}
	};

	//User Change Action
	const handleUserChange = async (data) => {
		try {
			const res = await http.put(`${process.env.NEXT_PUBLIC_BASE_URL}/role/update/users`, {
				roleId: roleId,
				userId: data.id,
			});
			if (res.statusCode == 200) {
				setAddNotification(false);
				setRemoveNotification(false);
				setUpdateNotification(true);
				roleUserListmutate();
			} else {
				alert('Update user fail, please refresh and try again');
			}
		} catch (error) {
			alert('Update user fail, please refresh and try again');
		}
	};

	//Search User
	const handleUserSearchField = async (email) => {
		setUserRows(userList.filter((item) => item.email.includes(email)));
	};

	const handleReadChange = (position) => {
		actionRows[position].canRead = !actionRows[position].canRead;
		setReadState(actionRows.map((action) => action.canRead));
		handleUpdateRoleAction(actionRows[position]);
	};

	const handleWriteChange = (position) => {
		actionRows[position].canWrite = !actionRows[position].canWrite;
		setWriteState(actionRows.map((action) => action.canWrite));
		handleUpdateRoleAction(actionRows[position]);
	};

	const handleSelectedRow = (selectedRow) => {
		setSelectionModel(selectedRow);
	};

	useEffect(() => {
		handleGetRoleAction();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roleName, removeButtonOpen, addButtonOpen]);

	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div style={{ display: 'flex' }}>
					<h1>{<>{roleName}</>}</h1>
					<div style={{ margin: '20px 0px 0px 10px' }}>
						{open && (
							<SearchField
								id={'userSearchField'}
								label={'Search User'}
								options={userList?.map((item) => item.email).sort(Intl.Collator().compare) || []}
								onChange={(event, value) => handleUserSearchField(value)}
							/>
						)}
					</div>
				</div>
				<div style={{ margin: '30px 10px 0px 0px' }}>
					<CustomButton
						onClick={handleCollapseChange}
						buttonContent={
							<div style={{ display: 'flex' }}>
								<GroupsIcon sx={{ margin: '0px 8px 0px 0px' }} />
								{roleUserList?.length || null} Users
								{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
							</div>
						}
					/>
				</div>
			</div>
			<Collapse in={open} timeout='auto' unmountOnExit>
				<TableWithPagination
					rows={userRows.length > 0 ? userRows : userList}
					columns={userColumns}
					rowCount={userList?.length}
					sortingMode={'client'}
					pagination={false}
				/>
			</Collapse>
			{!open && (
				<div>
					<TableWithPagination
						columns={actionColumns}
						rows={actionRows}
						rowCount={actionRowCount}
						checkboxSelection={true}
						sortingMode={'client'}
						onSelectionModelChange={(newSelectionModel) => {
							handleSelectedRow(newSelectionModel);
						}}
						selectionModel={selectionModel}
						pagination={false}
					/>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-start',
						}}
					>
						<div
							style={{
								margin: '10px 15px 0px 0px',
							}}
						>
							<CustomButton onClick={() => router.push('/roles')} buttonContent={'Back'} />
						</div>
						{selectionModel.length > 0 && (
							<div
								style={{
									margin: '10px 0px 0px 0px',
								}}
							>
								<TextButton
									handleClickOpen={handleRemoveButtonClickOpen}
									handleClose={handleRemoveButtonClose}
									buttonOpen={removeButtonOpen}
									buttonName={'- Remove'}
									buttonTitle={'Remove Actionss'}
									buttonContentText={'Do you want to delete the selected actions?'}
									buttonYes={'Yes'}
									buttonNo={'No'}
									buttonYesFunction={handleRemoveAction}
								/>
							</div>
						)}
						{selectionModel.length == 0 && (
							<div style={{ margin: '10px 0px 0px 0px' }}>
								<TextButton
									fullWidth={true}
									maxWidth={'md'}
									handleClickOpen={handleAddButtonClickOpen}
									handleClose={handleAddButtonClose}
									buttonOpen={addButtonOpen}
									buttonName={'+ Add'}
									buttonTitle={'Add Actions'}
									buttonContentText={'Please select actions to add to the role'}
									TextField={
										<div>
											<FormControl fullWidth>
												<InputLabel id='multiple-checkbox-label'>Actions List</InputLabel>
												<Select
													labelId='multiple-checkbox-label'
													id='multiple-checkbox'
													multiple
													value={actionName}
													onChange={handleActionNameChange}
													input={<OutlinedInput label='Actions List' />}
													renderValue={(selected) => selected.join(', ')}
													MenuProps={MenuProps}
												>
													{actionList
														?.filter((item) => !actionRows.map((row) => row.name).includes(item.name))
														?.map((item) => (
															<MenuItem key={item.id} value={item.name}>
																<Checkbox checked={actionName.indexOf(item.name) > -1} />
																<ListItemText primary={item.name} />
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									}
									buttonYes={'Submit'}
									buttonNo={'Close'}
									buttonYesFunction={handleAddAction}
								/>
							</div>
						)}
					</Box>
				</div>
			)}
			<Notification
				message={
					addNotification ? 'Added Successfully' : updateNotification ? 'Updated Successfully' : removeNotification ? 'Removed Successfully' : null
				}
				open={addNotification || updateNotification || removeNotification}
				handleClose={handleNotificationClose}
			/>
		</>
	);
}
