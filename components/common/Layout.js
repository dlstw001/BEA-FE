import { useRouter } from "next/router";
import ResponsiveAppBar from "./HeadBar.js";
import ResponsiveSideBar from "./Sidebar";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Layout({ children }) {
  const router = useRouter();
  let layout;
  if (router.pathname === "/" || router.pathname === "/callback") {
    layout = <div>{children}</div>;
  } else {
    layout = (
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CssBaseline />
        <ResponsiveAppBar />
        <ResponsiveSideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    );
  }

  return <div>{layout}</div>;
}
