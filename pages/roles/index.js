import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

//Custom Components
import SearchField from '../../components/searchfield/SearchField.';
import TableWithPagination from '../../components/table/TableWithPagination';
import TextButton from '../../components/button/TextButton';
import CustomButton from '../../components/button/CustomButton';
import Notification from '../../components/notification/Notification';
import CompareTable from '../../components/table/CompareTable';

//MUI Components
import { Box, Button, TextField, Collapse } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import CompareIcon from '@mui/icons-material/Compare';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';

//Data Fetching
import useGetRoleList from '../../hooks/RoleListHook';
import http from '../../api/http';

export default function RoleDashboard() {
	const router = useRouter();

	//Search Field
	const [searchEnabled, setSearchEnabled] = useState(false);

	//Table State
	const [rows, setRows] = useState([]);
	const [rowModesModel, setRowModesModel] = useState({});
	const [rowCount, setRowCount] = useState(0);
	const [selectionModel, setSelectionModel] = useState([]);
	const [sortBy, setSortBy] = useState(null);
	const [orderBy, setOrderBy] = useState(null);
	const [sortEanbled, setSortEnabled] = useState(false);
	const [page, setPage] = useState(0);

	//Button State
	const [deleteButtonOpen, setDeleteButtonOpen] = useState(false);
	const [createButtonOpen, setCreateButtonOpen] = useState(false);
	const [newRoleName, setNewRoleName] = useState('');
	const [newRoleDesc, setNewRoleDesc] = useState('');
	const [open, setOpen] = useState(false);

	//Notification State
	const [updateNotification, setUpdateNotification] = useState(false);
	const [deleteNotification, setDeleteNotification] = useState(false);
	const [createNotification, setCreateNotification] = useState(false);

	//Data Fetching
	const { roleList, roleListError, roleListMutate } = useGetRoleList();

	//Redirect Page
	const handleDetails = (data) => {
		router.push(`/roles/${data.name}?id=${data.id}`);
	};

	//Table columns settings
	const columns = [
		{ field: 'name', headerName: 'Name', editable: true, flex: 1 },
		{ field: 'desc', headerName: 'Description', editable: true, flex: 2 },
		{
			field: 'details',
			headerName: 'Details',
			flex: 0.6,
			renderCell: (params) => (
				<Button
					variant='outlined'
					sx={{
						borderColor: '#FFB81C',
						color: 'black',
						'&:hover': {
							backgroundColor: '#edac1c',
							borderColor: '#edac1c',
							boxShadow: 'none',
							color: 'white',
						},
					}}
					onClick={() => handleDetails(params.row)}
				>
					Click
				</Button>
			),
		},
		{
			field: 'actions',
			type: 'actions',
			flex: 0.2,
			minWidth: 100,
			getActions: ({ id }) => {
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						<GridActionsCellItem icon={<SaveIcon />} key='saveicon' label='Save' onClick={handleSaveClick(id)} />,
						<GridActionsCellItem
							icon={<CancelIcon />}
							key='cancelicon'
							label='Cancel'
							className='textPrimary'
							onClick={handleCancelClick(id)}
							color='inherit'
						/>,
					];
				}

				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						key='editicon'
						label='Edit'
						className='textPrimary'
						onClick={handleEditClick(id)}
						color='inherit'
					/>,
				];
			},
		},
	];

	//Table Functions
	const handleRowEditStart = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	const handleRowEditStop = (params, event) => {
		event.defaultMuiPrevented = true;
	};

	const handleEditClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
	};

	const handleSaveClick = (id) => () => {
		setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
	};

	const handleCancelClick = (id) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});
		const editedRow = rows.find((row) => row.id === id);
		if (editedRow.isNew) {
			setRows(rows.filter((row) => row.id !== id));
		}
	};

	const onPageChange = (page) => {
		setPage(page);
	};

	const onSortModelChange = (sortModel) => {
		if (sortModel[0]?.field != 'details' && sortModel.length > 0) {
			setSortEnabled(true);
			setSortBy(sortModel[0].field);
			setOrderBy(sortModel[0].sort);
			setPage(0);
			handleGetRoleListwPage();
		} else {
			setSortEnabled(false);
			setSortBy(null);
			setOrderBy(null);
			handleGetRoleListwPage();
		}
	};

	const handleSelectedRow = (selectedRow) => {
		setSelectionModel(selectedRow);
	};

	//Button Function
	const handleDeleteButtonClickOpen = () => {
		setDeleteButtonOpen(true);
	};

	const handleDeleteButtonClose = () => {
		setDeleteButtonOpen(false);
	};

	const handleCreateButtonClickOpen = () => {
		setCreateButtonOpen(true);
	};

	const handleCreateButtonClose = () => {
		setCreateButtonOpen(false);
		setNewRoleName('');
		setNewRoleDesc('');
	};

	//Notification Function
	const handleNotificationClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setUpdateNotification(false);
		setCreateNotification(false);
		setDeleteNotification(false);
	};

	//Update Role
	const processRowUpdate = async (newRow) => {
		const id = newRow.id;
		const reqBody = { name: newRow.name, desc: newRow.desc };
		try {
			const res = await http.put(`${process.env.NEXT_PUBLIC_BASE_URL}/role/${id}`, reqBody);
			if (res.statusCode === 200) {
				const updatedRow = { ...newRow, isNew: false };
				setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
				setCreateNotification(false);
				setDeleteNotification(false);
				setUpdateNotification(true);
				return updatedRow;
			} else {
				alert('Name has been used, please try another one');
				setRowModesModel({
					...rowModesModel,
					[id]: { mode: GridRowModes.View, ignoreModifications: true },
				});
				const editedRow = rows.find((row) => row.id === id);
				if (editedRow.isNew) {
					setRows(rows.filter((row) => row.id !== id));
				}
			}
		} catch (e) {
			alert('Error, please try again');
			setRowModesModel({
				...rowModesModel,
				[id]: { mode: GridRowModes.View, ignoreModifications: true },
			});
			const editedRow = rows.find((row) => row.id === id);
			if (editedRow.isNew) {
				setRows(rows.filter((row) => row.id !== id));
			}
		}
	};

	//Create Role
	const handleCreateAction = async () => {
		const reqBody = {
			name: newRoleName,
			desc: newRoleDesc,
		};
		try {
			const res = await http.post(`/role`, reqBody);
			if (res.statusCode === 200) {
				setCreateButtonOpen(false);
				setDeleteNotification(false);
				setUpdateNotification(false);
				setCreateNotification(true);
				roleListMutate();
			} else {
				alert(`${res.errors}`);
			}
		} catch (e) {
			alert('Error occured, please try again');
			setCreateButtonOpen(false);
		}
	};

	//Delete Role
	const handleDeleteRole = async () => {
		const reqBody = { data: { roleList: selectionModel } };
		try {
			const res = await http.delete(`/role/delete`, reqBody);
			if (res.statusCode === 200) {
				setSearchEnabled(false);
				roleListMutate();
				setDeleteButtonOpen(false);
				setCreateNotification(false);
				setUpdateNotification(false);
				setDeleteNotification(true);
			}
		} catch (e) {
			alert('Error, please try again');
		}
	};

	//Get Role list with pagination
	const handleGetRoleListwPage = async () => {
		if (sortEanbled) {
			const res = await http.get(`/role?page=${page + 1}&sort_by=${sortBy}&order_by=${orderBy}`);
			setRows(res.data);
		} else {
			const res = await http.get(`/role?page=${page + 1}`);
			setRowCount(res.total);
			setRows(res.data);
		}
	};

	//Search Role
	const handleRoleSearchField = async (data) => {
		if (data) {
			const res = await http.get(`/role?name=${data}`);
			setSearchEnabled(true);
			setPage(0);
			setSortBy(null);
			setOrderBy(null);
			setRows(res.data);
		} else {
			setSearchEnabled(false);
			handleGetRoleListwPage();
		}
	};

	//Role Comparision
	const handleCompareButtonClick = () => {
		setOpen(!open);
		setSearchEnabled(false);
		handleGetRoleListwPage();
	};

	useEffect(() => {
		if (!searchEnabled) {
			handleGetRoleListwPage();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, sortBy, orderBy, roleList]);

	return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <div>
            <h1>{`Roles `}</h1>
          </div>
          {!open && (
            <div style={{ margin: "20px 10px 0px 10px" }}>
              <SearchField
                id={"roleSearchField"}
                label={"Select Role"}
                options={
                  roleList
                    ?.map((item) => item.name)
                    .sort(Intl.Collator().compare) || []
                }
                onChange={(event, value) => handleRoleSearchField(value)}
              />
            </div>
          )}
          <div style={{ margin: "0px 0px 0px 8px" }}>
            {open && <h1>{` Comparision`}</h1>}
          </div>
        </div>
        <div style={{ margin: "30px 10px 0px 0px" }}>
          <CustomButton
            aria-label="expand row"
            onClick={handleCompareButtonClick}
            buttonContent={
              <div style={{ display: "flex" }}>
                <CompareIcon sx={{ marginRight: "8px" }} />
                Compare
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </div>
            }
          />
        </div>
      </Box>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <CompareTable />
      </Collapse>
      {!open && (
        <div>
          <TableWithPagination
            columns={columns}
            rows={rows}
            rowCount={rowCount}
            pagination={true}
            page={page}
            onPageChange={onPageChange}
            onSortModelChange={onSortModelChange}
            onSelectionModelChange={(newSelectionModel) => {
              handleSelectedRow(newSelectionModel);
            }}
            selectionModel={selectionModel}
            rowModesModel={rowModesModel}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            checkboxSelection={true}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ margin: "10px 0px 0px 0px" }}>
              {selectionModel.length == 0 && (
                <TextButton
                  handleClickOpen={handleCreateButtonClickOpen}
                  handleClose={handleCreateButtonClose}
                  buttonOpen={createButtonOpen}
                  buttonName={"+ Create"}
                  buttonTitle={"Create Roles"}
                  buttonContentText={
                    "Please fill in all the information to create a new role"
                  }
                  TextField={
                    <div>
                      <TextField
                        id="outlined-basic"
                        label="Role Name"
                        variant="outlined"
                        sx={{ marginRight: "10px" }}
                        //Get input value
                        onChange={(e) => setNewRoleName(e.target.value)}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Description"
                        variant="outlined"
                        sx={{ marginRight: "10px" }}
                        //Get input value
                        onChange={(e) => setNewRoleDesc(e.target.value)}
                      />
                    </div>
                  }
                  buttonYes={"Submit"}
                  buttonNo={"Close"}
                  buttonYesFunction={handleCreateAction}
                />
              )}
              {selectionModel.length > 0 && (
                <TextButton
                  handleClickOpen={handleDeleteButtonClickOpen}
                  handleClose={handleDeleteButtonClose}
                  buttonOpen={deleteButtonOpen}
                  buttonName={"- Delete"}
                  buttonTitle={"Delete Roles"}
                  buttonContentText={
                    "Do you want to delete the selected roles?"
                  }
                  buttonYes={"Yes"}
                  buttonNo={"No"}
                  buttonYesFunction={handleDeleteRole}
                />
              )}
            </div>
          </Box>
        </div>
      )}
      <Notification
        message={
          updateNotification
            ? "Updated Successfully"
            : deleteNotification
            ? "Deleted Successfully"
            : createNotification
            ? "Created Successfully"
            : ""
        }
        open={updateNotification || deleteNotification || createNotification}
        handleClose={handleNotificationClose}
      />
    </>
  );
}
