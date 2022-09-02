import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

//Custom components
import SearchField from '../../components/searchfield/SearchField.';
import TableWithPagination from '../../components/table/TableWithPagination';
import TextButton from '../../components/button/TextButton';
import Notification from '../../components/notification/Notification';

//MUI Components
import { Box, Chip, TextField, Checkbox, darkScrollbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';

//Data Fetching
import UserListHook from '../../hooks/UserListHook';
import http from '../../api/http';
import useGetUserPermission from "../../hooks/UserPermission";

export default function UserDashboard() {
  const router = useRouter();

  //Notification State
  const [createNotification, setCreateNotification] = useState(false);
  const [deleteNotification, setDeleteNotification] = useState(false);
  const [updateNotification, setUpdateNotification] = useState(false);

  //Search Field State
  const { userList, userListError, userListMutate } = UserListHook();
  const [userSearchEnabled, setUserSearchEnabled] = useState(false);

  //Table State
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [rowCount, setRowCount] = useState(0);
  const [selectionModel, setSelectionModel] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [sortEanbled, setSortEnabled] = useState(false);
  const [page, setPage] = useState(0);
  const [userStatus, setUserStatus] = useState([]);
  const [adminState, setAdminState] = useState([]);
  const [superAdminState, setSuperAdminState] = useState([]);

  //Button State
  const [deleteButtonOpen, setDeleteButtonOpen] = useState(false);
  const [createButtonOpen, setCreateButtonOpen] = useState(false);
  const [editButtonId, setEditButtonId] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  //isSuperAdmin
  const { userPermission, userPermissionError } = useGetUserPermission();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  //Admin Table Columns
  const adminColumns = [
    { field: "name", headerName: "Name", editable: true, flex: 0.15 },
    { field: "email", headerName: "Email", editable: true, flex: 0.25 },
    {
      field: "role",
      headerName: "Role",
      editable: false,
      flex: 0.8,
      renderCell: (data) => (
        <Box>
          {data.row.role
            .sort(Intl.Collator().compare)
            .toString()
            .split(",")
            .join(", ")}
        </Box>
      ),
    },
    {
      field: "isAdmin",
      headerName: "BEA Admin",
      flex: 0.15,
      renderCell: (data) => (
        <Checkbox
          color="primary"
          checked={adminState[data.row.index]}
          onChange={() => handleAdminChange(data.row.index)}
        />
      ),
    },
    {
      field: "superAdmin",
      headerName: "BEA Super Admin",
      flex: 0.15,
      renderCell: (data) => (
        <Checkbox
          color="primary"
          checked={superAdminState[data.row.index]}
          onChange={() => handleSuperAdminChange(data.row.index)}
        />
      ),
    },
    {
      field: "active",
      headerName: "Status",
      flex: 0.1,
      renderCell: (data) =>
        userStatus[data.row.index] ? (
          <Chip
            label="Active"
            color="success"
            variant="outlined"
            onClick={() => handleUserStatusChange(data.row.index)}
          />
        ) : (
          <Chip
            label="Inactive"
            variant="outlined"
            color="error"
            onClick={() => handleUserStatusChange(data.row.index)}
          />
        ),
    },
    {
      field: "actions",
      type: "actions",
      flex: 0.1,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              key="saveicon"
              label="Save"
              className="textPrimary"
              color="inherit"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              key="cancelicon"
              label="Cancel"
              className="textPrimary"
              color="inherit"
              onClick={handleCancelClick(id)}
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            key="editicon"
            label="Edit"
            className="textPrimary"
            color="inherit"
            onClick={handleEditClick(id)}
          />,
        ];
      },
    },
  ];

  //Normal Table columns
  const normalColumns = [
    { field: "name", headerName: "Name", flex: 0.15 },
    { field: "email", headerName: "Email", flex: 0.25 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.8,
      renderCell: (data) => (
        <Box>
          {data.row.role
            .sort(Intl.Collator().compare)
            .toString()
            .split(",")
            .join(", ")}
        </Box>
      ),
    },
    {
      field: "isAdmin",
      headerName: "BEA Admin",
      flex: 0.15,
      renderCell: (data) => (
        <Checkbox
          color="primary"
          disabled={true}
          checked={adminState[data.row.index]}
        />
      ),
    },
    {
      field: "superAdmin",
      headerName: "BEA Super Admin",
      flex: 0.15,
      renderCell: (data) => (
        <Checkbox
          color="primary"
          disabled={true}
          checked={superAdminState[data.row.index]}
        />
      ),
    },
    {
      field: "active",
      headerName: "Status",
      flex: 0.1,
      renderCell: (data) =>
        data.value ? (
          <Chip label="Active" color="success" variant="outlined" />
        ) : (
          <Chip label="Inactive" variant="outlined" color="error" />
        ),
    },
  ];

  //Notification Function
  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCreateNotification(false);
    setDeleteNotification(false);
    setUpdateNotification(false);
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
    setNewUserName("");
    setNewUserEmail("");
  };

  //Tabel Actions
  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setEditButtonId([...editButtonId, id]);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setEditButtonId(editButtonId.filter((item) => item !== id));
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setEditButtonId(editButtonId.filter((item) => item !== id));
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleAdminChange = (position) => {
    if (userSearchEnabled) {
      rows[0].isAdmin = !rows[0].isAdmin;
      setAdminState({ ...adminState, [position]: !adminState[position] });
      handleUpdateUserPermissions(rows[0]);
    } else {
      rows[position].isAdmin = !rows[position].isAdmin;
      setAdminState({ ...adminState, [position]: !adminState[position] });
      handleUpdateUserPermissions(rows[position]);
    }
  };

  const handleSuperAdminChange = (position) => {
    if (userSearchEnabled) {
      rows[0].superAdmin = !rows[0].superAdmin;
      setSuperAdminState({
        ...superAdminState,
        [position]: !superAdminState[position],
      });
      handleUpdateUserPermissions(rows[0]);
    } else {
      rows[position].superAdmin = !rows[position].superAdmin;
      setSuperAdminState({
        ...superAdminState,
        [position]: !superAdminState[position],
      });
      handleUpdateUserPermissions(rows[position]);
    }
  };

  const handleUserStatusChange = (position) => {
    if (userSearchEnabled) {
      rows[0].active = !rows[0].active;
      setUserStatus({ ...userStatus, [position]: !userStatus[position] });
      handleUpdateUserPermissions(rows[0]);
    } else {
      rows[position].active = !rows[position].active;
      setUserStatus({ ...userStatus, [position]: !userStatus[position] });
      handleUpdateUserPermissions(rows[position]);
    }
  };

  //Update User permission
  const handleUpdateUserPermissions = async (user) => {
    const reqBody = {
      active: user.active,
      isAdmin: user.isAdmin,
      superAdmin: user.superAdmin,
    };
    try {
      const res = await http.put(`/user/${user.id}`, reqBody);
      setDeleteNotification(false);
      setCreateNotification(false);
      setUpdateNotification(true);
    } catch (e) {
      alert(e);
    }
  };

  //Select Rows
  const handleSelectedRow = (selectionModel) => {
    setSelectionModel(selectionModel);
  };

  //Create User
  const handleCreateUser = async () => {
    if (newUserName.length == 0 || newUserEmail.length == 0) {
      return alert("Please fill in all fields");
    }
    const reqBody = {
      name: newUserName,
      email: newUserEmail,
      isAdmin: true,
    };
    try {
      await http.post("/user", reqBody);
      setCreateButtonOpen(false);
      setNewUserName("");
      setNewUserEmail("");
      userListMutate();
      handleGetUserListwPage();
      setDeleteNotification(false);
      setUpdateNotification(false);
      setCreateNotification(true);
    } catch (error) {
      alert(error);
    }
  };

  //Update User
  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    try {
      await http.put(`/user/${newRow.id}`, newRow);
      userListMutate();
      setDeleteNotification(false);
      setCreateNotification(false);
      setUpdateNotification(true);
      return updatedRow;
    } catch (error) {
      alert(error);
    }
  };
  //Handle Update Rows Error
  const handleProcessRowUpdateError = (error) => {
    alert("Error, please try again");
  };

  //Delete User
  const handleDeleteUser = async () => {
    const reqBody = { userIds: selectionModel };
    try {
      const res = await http.delete("/user/del/user", { data: reqBody });
      setDeleteButtonOpen(false);
      setUpdateNotification(false);
      setCreateNotification(false);
      setDeleteNotification(true);
      userListMutate();
      handleGetUserListwPage();
    } catch (error) {
      alert(error);
    }
  };

  //Get User list with pagination
  const handleGetUserListwPage = async () => {
    if (sortEanbled) {
      const res = await http.get(
        `/user?page=${page + 1}&sort_by=${sortBy}&order_by=${orderBy}`,
      );
      let data = res.data;
      data.map((item, index) => {
        item.index = index;
      });
      setRows(data);
      setAdminState(data.map((item) => item.isAdmin));
      setSuperAdminState(data.map((item) => item.superAdmin));
      setUserStatus(data.map((item) => item.active));
    } else {
      const res = await http.get(`/user?page=${page + 1}`);
      let data = res.data;
      data.map((item, index) => {
        item.index = index;
      });
      setRowCount(res.total);
      setRows(data);
      setAdminState(data.map((item) => item.isAdmin));
      setSuperAdminState(data.map((item) => item.superAdmin));
      setUserStatus(data.map((item) => item.active));
    }
  };

  //Page Change
  const onPageChange = (page) => {
    setPage(page);
  };

  //Sorting
  const onSortModelChange = (sortModel) => {
    if (sortModel[0]?.field != "details" && sortModel.length > 0) {
      setSortEnabled(true);
      setSortBy(sortModel[0].field);
      setOrderBy(sortModel[0].sort);
      setPage(0);
      handleGetUserListwPage();
    } else {
      setSortEnabled(false);
      setSortBy(null);
      setOrderBy(null);
      handleGetUserListwPage();
    }
  };

  //Search user by email
  const handleUserSearch = async (email) => {
    if (email) {
      //Need to change
      let res = await http.get(`/user/get/user?email=${email}`);
      res.data.index = 0;
      setUserSearchEnabled(true);
      setPage(0);
      setSortBy(null);
      setOrderBy(null);
      setRows([res.data]);
      setAdminState([res.data.isAdmin]);
      setSuperAdminState([res.data.superAdmin]);
      setUserStatus([res.data.active]);
    } else {
      setUserSearchEnabled(false);
      handleGetUserListwPage();
    }
  };

  useEffect(() => {
    if (!userSearchEnabled) {
      handleGetUserListwPage();
    }
  }, [page, sortBy, orderBy]);

  useEffect(() => {
    if (userPermission) {
      setIsSuperAdmin(userPermission.superAdmin);
    }
  }, [userPermission]);

  return (
    <>
      <Box style={{ display: "flex" }}>
        <div style={{ display: "flex", alignContent: "cneter" }}>
          <div>
            <h1>Users </h1>
          </div>
          <div style={{ margin: "20px 0px 0px 10px" }}>
            <SearchField
              id={"userSearchField"}
              label={"Select Email"}
              options={
                userList
                  ?.map((user) => user.email)
                  .sort(Intl.Collator().compare) || []
              }
              onChange={(event, value) => handleUserSearch(value)}
            />
          </div>
        </div>
      </Box>
      <TableWithPagination
        columns={isSuperAdmin ? adminColumns : normalColumns}
        rows={rows}
        rowCount={rowCount}
        pagination={true}
        page={page}
        onPageChange={onPageChange}
        onSortModelChange={onSortModelChange}
        checkboxSelection={isSuperAdmin}
        rowModesModel={rowModesModel}
        onSelectionModelChange={(newSelectionModel) => {
          handleSelectedRow(newSelectionModel);
        }}
        selectionModel={selectionModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
      />
      {isSuperAdmin && (
        <Box
          sx={{
            display: "flex",
            margin: "10px 0px 0px 0px",
          }}
        >
          {selectionModel.length > 0 && (
            <div style={{ margin: "0px 10px 10px 0px" }}>
              <TextButton
                handleClickOpen={handleDeleteButtonClickOpen}
                handleClose={handleDeleteButtonClose}
                buttonOpen={deleteButtonOpen}
                buttonName={"- Delete"}
                buttonTitle={"Delete Users"}
                buttonContentText={"Do you want to delete the selected users?"}
                buttonYes={"Yes"}
                buttonNo={"No"}
                buttonYesFunction={handleDeleteUser}
              />
            </div>
          )}
          {selectionModel.length == 0 && (
            <div style={{ margin: "0px 10px 10px 0px" }}>
              <TextButton
                handleClickOpen={handleCreateButtonClickOpen}
                handleClose={handleCreateButtonClose}
                buttonOpen={createButtonOpen}
                buttonName={"+ Create"}
                buttonTitle={"Create User"}
                buttonContentText={
                  "Please fill in all the information to create a new user"
                }
                TextField={
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <TextField
                      id="outlined-basic"
                      label="User Name"
                      variant="outlined"
                      sx={{ marginBottom: "10px" }}
                      onChange={(event) => setNewUserName(event.target.value)}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      onChange={(event) => setNewUserEmail(event.target.value)}
                    />
                  </div>
                }
                buttonYes={"Submit"}
                buttonNo={"Close"}
                buttonYesFunction={handleCreateUser}
              />
            </div>
          )}
        </Box>
      )}
      <Notification
        message={
          createNotification
            ? "Created Successfully"
            : updateNotification
            ? "Updated Successfully"
            : deleteNotification
            ? "Deleted Successfully"
            : null
        }
        open={createNotification || updateNotification || deleteNotification}
        handleClose={handleNotificationClose}
      />
    </>
  );
}
