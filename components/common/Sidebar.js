import { useRouter } from "next/router";
import { useState, useEffect } from "react";

//MUI Components
import {
  Drawer,
  Toolbar,
  ListItem,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

//Data Fetching
import useGetUserPermission from '../../hooks/UserPermission';

export default function ResponsiveSideBar() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { userPermission, userPermissionError} = useGetUserPermission();
  const drawerWidth = drawerOpen ? 260 : 70;

  useEffect(() => {
    if (localStorage.getItem("drawerOpen")) {
      setDrawerOpen(JSON.parse(window.localStorage.getItem("drawerOpen")));
    }
  }, []);

  useEffect(() => {
    if (userPermission) {
      setIsSuperAdmin(userPermission.superAdmin);
      if (!userPermission.active || (!userPermission.superAdmin && !userPermission.isAdmin)){
        localStorage.clear();
        window.location.href = process.env.NEXT_PUBLIC_APP_LOGOUT;
      }
    }
  }, [userPermission]);


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      anchor="left"
    >
      <Toolbar />
      {drawerOpen ? (
        <div>
          <Box sx={{ padding: "15px" }}>
            <div>
              <Typography
                variant="h6"
                sx={{
                  alignSelf: "left",
                  margin: "15px 0px 10px 10px",
                  fontWeight: "bold",
                }}
              >
                {isSuperAdmin ? "Admin Panel" : "Control Panel"}
              </Typography>
              <Divider />
            </div>
            <List>
              {["Systems", "Roles", "Users"].map((text, index) => (
                <div key={`Open_${index}`}>
                  <ListItem>
                    <ListItemButton
                      onClick={() =>
                        router.push({ pathname: `/${text.toLowerCase()}` })
                      }
                    >
                      <ListItemIcon>
                        {text == "Systems" ? (
                          <SettingsSystemDaydreamOutlinedIcon />
                        ) : text == "Users" ? (
                          <GroupOutlinedIcon />
                        ) : text == "Roles" ? (
                          <ManageAccountsOutlinedIcon />
                        ) : (
                          " "
                        )}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                </div>
              ))}
              {isSuperAdmin === true && (
                <ListItem key={"Open_SuperAdmin_Panel"}>
                  <ListItemButton onClick={() => router.push("/log")}>
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Log" />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Box>
          <Box sx={{ position: "absolute", bottom: "0", right: "0" }}>
            <IconButton
              size="large"
              onClick={() => {
                window.localStorage.setItem(
                  "drawerOpen",
                  JSON.stringify(false),
                );
                return setDrawerOpen(false);
              }}
            >
              <MenuOpenIcon fontSize="medium" />
            </IconButton>
          </Box>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "10px",
          }}
        >
          <List>
            {["Systems", "Roles", "Users"].map((text, index) => (
              <div key={`Close_${index}`}>
                <ListItem>
                  <ListItemButton
                    sx={{
                      justifyContent: "center",
                    }}
                    onClick={() => router.push(`/${text.toLowerCase()}`)}
                  >
                    <ListItemIcon
                      sx={{
                        justifyContent: "center",
                      }}
                    >
                      {text == "Systems" ? (
                        <SettingsSystemDaydreamOutlinedIcon />
                      ) : text == "Users" ? (
                        <GroupOutlinedIcon />
                      ) : text == "Roles" ? (
                        <ManageAccountsOutlinedIcon />
                      ) : (
                        " "
                      )}
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              </div>
            ))}
            {isSuperAdmin === true && (
              <div key={"Open_SuperAdmin_Panel"}>
                <ListItem>
                  <ListItemButton
                    sx={{
                      justifyContent: "center",
                    }}
                    onClick={() => router.push("/log")}
                  >
                    <ListItemIcon
                      sx={{
                        justifyContent: "center",
                      }}
                    >
                      <DashboardIcon />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              </div>
            )}
          </List>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <List>
              <ListItem key="OpenDrawerButton">
                <ListItemButton
                  sx={{
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    window.localStorage.setItem(
                      "drawerOpen",
                      JSON.stringify(true),
                    );
                    return setDrawerOpen(true);
                  }}
                >
                  <MenuIcon fontSize="medium" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </div>
      )}
    </Drawer>
  );
}
