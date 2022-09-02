import React, { useEffect, useState } from "react";

//Custome Component
import SearchField from "../searchfield/SearchField.";

//MUI Components
import { IconButton } from "@mui/material";
import { red, blue, yellow } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import LockIcon from "@mui/icons-material/Lock";

//Data Fetching
import useGetActionList from "../../hooks/ActionListHook";
import useGetRoleList from "../../hooks/RoleListHook";

export default function CompareTable() {
  const [columns, setColumns] = useState([]);
  const [actionColumns, setActionColumns] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [SearchFieldKey, setSearchFieldKey] = useState(0);

  const { actionList, actionListError, actionListMutate } = useGetActionList();
  const { roleList, roleListError, roleListMutate } = useGetRoleList();

  const handleRoleCompare = (data) => {
    setColumns([...columns, data]);
    setSearchOptions([...searchOptions.filter((item) => item != data.name)]);
    setSearchFieldKey(SearchFieldKey + 1);
  };

  const handleCancelClick = (data) => {
    setColumns([...columns.filter((item) => item.name != data)]);
    setSearchOptions([...searchOptions, data].sort(Intl.Collator().compare));
  };

  useEffect(() => {
    if (actionList) {
      setActionColumns([...actionList.sort(Intl.Collator().compare)]);
    }
  }, [actionList]);

  useEffect(() => {
    if (roleList) {
      setSearchOptions([...roleList.map((role) => role.name)]);
    }
  }, [roleList]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignContent: "center",
            marginRight: "10px",
          }}
        >
          <ChromeReaderModeIcon sx={{ color: blue[900] }} />
          {` - Can Read | `}
        </div>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            marginRight: "10px",
          }}
        >
          <CreateIcon sx={{ color: yellow[900] }} />
          {` - Can Write | `}
        </div>
        <div style={{ display: "flex", alignContent: "center" }}>
          <LockIcon sx={{ color: red[900] }} />
          {` - Unavailable`}
        </div>
      </div>
      <div style={{ display: "flex", alignContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "25px",
              fontWeight: "bold",
              lineHeight: "50px",
              minWidth: "250px",
              backgroundColor: "#FFB81C",
              border: "1px solid #994C00",
              padding: "0px 0px 0px 10px",
            }}
          >
            {"System Actions"}
          </div>
          {actionColumns.map((action) => (
            <div
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                minWidth: "200px",
                borderBottom: "1px solid #994C00",
                borderRight: "1px solid #994C00",
                borderLeft: "1px solid #994C00",
                padding: "10.75px",
              }}
              key={action.id}
            >
              {action.name}
            </div>
          ))}
        </div>
        {columns.length > 0 &&
          columns.map((role) => (
            <div
              key={role.id}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                  minWidth: "250px",
                  lineHeight: "50px",
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                  backgroundColor: "#FFB81C",
                  borderTop: "1px solid #994C00",
                  borderRight: "1px solid #994C00",
                  borderBottom: "1px solid #994C00",
                }}
              >
                {role.name}
                <IconButton
                  aria-label="delete"
                  onClick={() => handleCancelClick(role.name)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              {actionColumns.map((action) => {
                let data = role.actions?.find(
                  (item) => item.action === action.id,
                );
                if (data) {
                  return (
                    <div
                      style={{
                        marginTop: "0px",
                        fontSize: "20px",
                        borderBottom: "1px solid #994C00",
                        borderRight: "1px solid #994C00",
                        minWidth: "200px",
                        padding: "5px",
                      }}
                      key={`${role.id}_${action.id}`}
                    >
                      {data.canRead ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",
                            padding: "5px",
                          }}
                        >
                          <ChromeReaderModeIcon sx={{ color: blue[900] }} />
                        </div>
                      ) : data.canWrite ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",
                            padding: "5px",
                          }}
                        >
                          <CreateIcon sx={{ color: yellow[900] }} />
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",
                            padding: "5px",
                          }}
                        >
                          <LockIcon sx={{ color: red[900] }} />
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        marginTop: "0px",
                        fontSize: "20px",
                        borderBottom: "1px solid #994C00",
                        borderRight: "1px solid #994C00",
                        padding: "5px",
                      }}
                      key={`${role.id}_${action.id}`}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignContent: "center",
                          padding: "5px",
                        }}
                      >
                        <LockIcon sx={{ color: red[800] }} />
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          ))}
        <div style={{ marginLeft: "50px" }}>
          <React.Fragment key={SearchFieldKey}>
            <SearchField
              id={"rolelist_field"}
              options={searchOptions}
              label={"Select Roles"}
              onChange={(event, value) => {
                if (value) {
                  handleRoleCompare(
                    roleList.filter((role) => role.name === value)[0],
                  );
                }
              }}
            />
          </React.Fragment>
        </div>
      </div>
    </div>
  );
}
