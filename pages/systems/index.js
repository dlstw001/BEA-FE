import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

//Custom Components
import TableWithPagination from "../../components/table/TableWithPagination";
import SearchField from "../../components/searchfield/SearchField.";
import TextButton from "../../components/button/TextButton";
import CustomButton from "../../components/button/CustomButton";
import Notification from "../../components/notification/Notification";

//MUI Components
import { Box, TextField, Typography, Collapse } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { GridRowModes, GridActionsCellItem } from "@mui/x-data-grid-pro";

//Data Fetching
import useGetSystemList from "../../hooks/SystemListHook";
import useGetSystemActionList from "../../hooks/SystemActionListHook";
import useGetUserPermission from "../../hooks/UserPermission";
import http from "../../api/http";
import { Router } from "@mui/icons-material";

export default function SystemDashboard() {
  const router = useRouter();
  //Search Feild State
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [system, setSystem] = useState(null);

  //Table State
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectionModel, setSelectionModel] = useState([]);
  const [actionId, setActionId] = useState(null);
  const [systemId, setSystemId] = useState(null);

  //Button State
  const [deleteButtonOpen, setDeleteButtonOpen] = useState(false);
  const [createButtonOpen, setCreateButtonOpen] = useState(false);
  const [open, setOpen] = useState(false);

  //Create Action Button Input Field State
  const [newActionName, setNewActionName] = useState("");
  const [newActionDesc, setNewActionDesc] = useState("");

  //Create System Button Input Field State
  const [newSystemName, setNewSystemName] = useState("");
  const [newSystemURL, setNewSystemURL] = useState("");

  //Notification State
  const [updateNotification, setUpdateNotification] = useState(false);
  const [deleteNotification, setDeleteNotification] = useState(false);
  const [createNotification, setCreateNotification] = useState(false);

  //Data Fetching
  const { systemList, systemListError, systemListMutate } = useGetSystemList();
  const { actionList, actionListError, actionListMutate } =
    useGetSystemActionList(system);

  //IsSuperAdmin
  const { userPermission, userPermissionError } = useGetUserPermission();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  //System Table Column Setting
  const systemTableColumns = [
    {
      field: "name",
      headerName: "System name",
      editable: true,
      flex: 0.3,
    },
    {
      field: "callbackUrl",
      headerName: "Callback URL",
      editable: true,
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      width: 100,
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

  //Action Table Column Setting
  const actionTableColumns = [
    {
      field: "name",
      headerName: "Action name",
      editable: true,
      flex: 0.3,
    },
    { field: "desc", headerName: "Description", editable: true, flex: 1 },
    {
      field: "actions",
      type: "actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              key="saveicon1"
              label="Save"
              className="textPrimary"
              color="inherit"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              key="cancelicon2"
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
            key="editicon2"
            label="Edit"
            className="textPrimary"
            color="inherit"
            onClick={handleEditClick(id)}
          />,
        ];
      },
    },
  ];

  //Notification Function
  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCreateNotification(false);
    setUpdateNotification(false);
    setDeleteNotification(false);
  };

  //Collapse Function
  const handleCollapseOpen = () => {
    setRowModesModel({});
    setSelectionModel([]);
    setOpen(!open);
    setSystem(null);
    setRows([]);
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
    setNewActionName("");
    setNewActionDesc("");
    setNewSystemName("");
    setNewSystemURL("");
  };

  //Table Function
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
  };

  //Select Rows
  const handleSelectedRow = (selectedRow) => {
    setSelectionModel(selectedRow);
  };

  //Create System
  const handleCreateSystem = async () => {
    if (newSystemName?.length == 0 && newSystemURL?.length == 0) {
      alert("Please fill all the fields");
    }
    if (newSystemURL.includes(",")) {
      newSystemURL = newSystemURL.split(",");
    }
    const reqBody = {
      name: newSystemName,
      callbackUrl: newSystemURL,
    };
    try {
      await http.post("/system", reqBody);
      systemListMutate();
      setDeleteNotification(false);
      setUpdateNotification(false);
      setCreateNotification(true);
      return handleCreateButtonClose();
    } catch (error) {
      return alert(error);
    }
  };

  //Delete System
  const handleDeleteSystem = async () => {
    const reqBody = { systemIds: selectionModel };
    try {
      const res = await http.delete("system/del/sys", { data: reqBody });
      setDeleteButtonOpen(false);
      systemListMutate();
      setUpdateNotification(false);
      setCreateNotification(false);
      setDeleteNotification(true);
    } catch (error) {
      alert(error);
    }
  };

  //Update System
  const processSystemRowUpdate = async (newRow) => {
    if (newRow.callbackUrl.includes(",")) {
      newRow.callbackUrl = newRow.callbackUrl.trim().split(",");
    }
    const id = newRow.id;
    setSystemId(id);
    const reqBody = { name: newRow.name, callbackUrl: newRow.callbackUrl };
    await http.put(`/system/${id}`, reqBody);
    setCreateNotification(false);
    setDeleteNotification(false);
    setUpdateNotification(true);
    const updatedRow = { ...newRow, isNew: false };
    systemListMutate();
    return updatedRow;
  };

  //Handle Update System Error
  const handleSystemProcessRowUpdateError = async (error) => {
    alert(error);
    setRowModesModel({
      ...rowModesModel,
      [systemId]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  //Create Action
  const handleCreateAction = async () => {
    if (newActionName === "") {
      return alert("Please enter a name for the action");
    }
    const reqBody = {
      systemName: system,
      name: `${system}_${newActionName}`,
      desc: newActionDesc,
    };
    try {
      const res = await http.post(`/system/create/action`, reqBody);
      setCreateButtonOpen(false);
      setUpdateNotification(false);
      setDeleteNotification(false);
      setCreateNotification(true);
      setNewActionName("");
      setNewActionDesc("");
      actionListMutate();
    } catch (e) {
      alert(`${e}`);
      setCreateButtonOpen(false);
      setNewActionName("");
      setNewActionDesc("");
    }
  };

  //Delete Action
  const handleDeleteAction = async () => {
    const reqBody = { data: { systemName: system, actionId: selectionModel } };
    try {
      const res = await http.delete(`/system`, reqBody);
      setCreateNotification(false);
      setUpdateNotification(false);
      setDeleteNotification(true);
      setDeleteButtonOpen(false);
      setRows(rows.filter((row) => !selectionModel.includes(row.id)));
      setRowCount(rowCount - selectionModel.length);
    } catch (e) {
      alert("Error, please try again");
    }
  };

  //Update Action
  const processActionRowUpdate = async (newRow) => {
    console.log(newRow);
    const id = newRow.id;
    setActionId(id);
    const reqBody = { system: system, name: newRow.name, desc: newRow.desc };
    const res = await http.put(`/action/${id}`, reqBody);
    setCreateNotification(false);
    setDeleteNotification(false);
    setUpdateNotification(true);
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  //Handle Update Action Error
  const handleActionProcessRowUpdateError = (error) => {
    alert(`${error}`);
    setRowModesModel({
      ...rowModesModel,
      [actionId]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  //Search Field
  const handleSystemSearchField = async (data) => {
    data ? setSearchEnabled(true) : setSearchEnabled(false);
    if (data) {
      setSystem(data);
    } else {
      setRows([]);
      setSystem(null);
    }
  };

  //Data Revalidation
  const handleUseGetSystemActionList = () => {
    if (actionList) {
      setRows(actionList);
      setRowCount(actionList?.length);
    }
  };

  useEffect(() => {
    if (searchEnabled) {
      handleUseGetSystemActionList();
    }
  }, [actionList]);

  //Check SuperAdmin
  useEffect(() => {
    if (userPermission) {
      setIsSuperAdmin(userPermission.superAdmin);
      router.push("/systems");
    }
  }, [userPermission]);

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignContent: "center" }}>
          <h1>Systems </h1>
          {open ? (
            <div style={{ marginLeft: "10px" }}>
              <h1>List</h1>
            </div>
          ) : (
            <div style={{ margin: "20px 10px 0px 10px" }}>
              <SearchField
                id={"systemSearchField"}
                label={"Select System"}
                onChange={(event, value) => {
                  handleSystemSearchField(value);
                }}
                options={systemList?.map((item) => item.name) || []}
              />
            </div>
          )}
        </div>
        {isSuperAdmin && (
          <div style={{ margin: "30px 10px 0px 0px" }}>
            <CustomButton
              aria-label="expand row"
              onClick={handleCollapseOpen}
              buttonContent={
                <div style={{ display: "flex" }}>
                  <TuneIcon sx={{ marginRight: "8px" }} />
                  System Settings
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </div>
              }
            />
          </div>
        )}
      </Box>
      {open && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <TableWithPagination
            columns={systemTableColumns}
            rows={systemList}
            rowCount={systemList?.length}
            rowModesModel={rowModesModel}
            checkboxSelection={true}
            sortingMode={"client"}
            onSelectionModelChange={(newSelectionModel) => {
              handleSelectedRow(newSelectionModel);
            }}
            selectionModel={selectionModel}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processSystemRowUpdate}
            onProcessRowUpdateError={handleSystemProcessRowUpdateError}
          />
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
                  buttonTitle={"Delete Systems"}
                  buttonContentText={
                    "Do you want to delete the selected systems?"
                  }
                  buttonYes={"Yes"}
                  buttonNo={"No"}
                  buttonYesFunction={handleDeleteSystem}
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
                  buttonTitle={"Create System"}
                  buttonContentText={
                    "Please fill in all the information to create a new system"
                  }
                  TextField={
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <TextField
                        id="outlined-basic"
                        label="System Name"
                        variant="outlined"
                        sx={{ marginBottom: "10px" }}
                        onChange={(event) =>
                          setNewSystemName(event.target.value)
                        }
                      />
                      <TextField
                        id="outlined-basic"
                        label="Callback URL"
                        variant="outlined"
                        onChange={(event) =>
                          setNewSystemURL(event.target.value)
                        }
                      />
                    </div>
                  }
                  buttonYes={"Submit"}
                  buttonNo={"Close"}
                  buttonYesFunction={handleCreateSystem}
                />
              </div>
            )}
          </Box>
        </Collapse>
      )}
      {!open && (
        <div>
          <TableWithPagination
            columns={actionTableColumns}
            rows={rows || []}
            rowCount={rowCount || 0}
            rowModesModel={rowModesModel}
            checkboxSelection={true}
            onSelectionModelChange={(newSelectionModel) => {
              handleSelectedRow(newSelectionModel);
            }}
            selectionModel={selectionModel}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processActionRowUpdate}
            onProcessRowUpdateError={handleActionProcessRowUpdateError}
          />

          {searchEnabled && (
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
                    buttonTitle={"Delete Actions"}
                    buttonContentText={
                      "Do you want to delete the selected actions?"
                    }
                    buttonYes={"Yes"}
                    buttonNo={"No"}
                    buttonYesFunction={handleDeleteAction}
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
                    buttonTitle={"Create Actions"}
                    buttonContentText={
                      "Please fill in all the information to create a new action"
                    }
                    TextField={
                      <div>
                        <div>
                          <TextField
                            id="outlined-basic"
                            label="Action Name"
                            variant="outlined"
                            sx={{ marginRight: "10px" }}
                            onChange={(event) =>
                              setNewActionName(event.target.value)
                            }
                          />
                          <TextField
                            id="outlined-basic"
                            label="Description"
                            variant="outlined"
                            sx={{ marginRight: "10px" }}
                            onChange={(event) =>
                              setNewActionDesc(event.target.value)
                            }
                          />
                        </div>
                        <Typography
                          sx={{
                            marginTop: "5px",
                            color: "red",
                            fontSize: "15px",
                          }}
                        >
                          * System Name will be added automatically, no need to
                          fill in
                        </Typography>
                      </div>
                    }
                    buttonYes={"Submit"}
                    buttonNo={"Close"}
                    buttonYesFunction={handleCreateAction}
                  />
                </div>
              )}
            </Box>
          )}
        </div>
      )}
      <Notification
        message={
          updateNotification
            ? "Updated Successfully"
            : createNotification
            ? "Created Successfully"
            : deleteNotification
            ? "Deleted Successfully"
            : ""
        }
        open={updateNotification || createNotification || deleteNotification}
        handleClose={handleNotificationClose}
      />
    </>
  );
}

