import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';

//MUI Compnents
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';

const ResponsiveAppBar = () => {
const settings = ["Logout"];
const [anchorElUser, setAnchorElUser] = useState(null);
const [userName, setUserName] = useState("");
const [image, setImage] = useState("/navbarLogo.svg");
const [icon, setIcon] = useState(null);
const [secretTime, setSecretTime] = useState(0);
const [count, setCount] = useState(0);
const router = useRouter();

const handleOpenUserMenu = (event) => {
  setAnchorElUser(event.currentTarget);
};

const handleCloseUserMenu = () => {
  setAnchorElUser(null);
};

const Logout = () => {
  localStorage.clear();
  window.location.href = process.env.NEXT_PUBLIC_APP_LOGOUT;
};

const playAudio = () => {
  new Audio("/sound.mp3").play();
};

const secretCounter = () => {
  if (secretTime == 0) {
    const startTime = Date.now() / 1000;
    setSecretTime(startTime);
  }
  console.log(`st: ${secretTime}`);
  let currentTime = Date.now() / 1000;
  console.log(Math.floor(currentTime - secretTime));
  if (secretTime != 0) {
    if (Math.floor(currentTime - secretTime) <= 1) {
      if (count > 10 && image == "/navbarLogo.svg") {
        setImage("/avengers.svg");
        switch (userName) {
          case "ying Boy":
            setIcon("/ironman.jpg");
            break;
          case "David Leung":
            setIcon("/racoon.jpg");
            break;
        }
        playAudio();
      } else {
        setCount((count = count + 1));
      }
    } else {
      setCount(0);
      setSecretTime(0);
    }
  }
};

useEffect(() => {
  setUserName(window.localStorage.getItem("userName"));
}, []);

return (
  <AppBar
    position="fixed"
    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    style={{ backgroundColor: "black" }}
  >
    <Container maxWidth="full">
      <Toolbar disableGutters>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            mr: 1,
          }}
        >
          <Link href="/systems">
            <a>
              <Image
                src={image}
                alt="icon"
                width="180"
                height="64"
                onClick={secretCounter}
              />
            </a>
          </Link>
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar src={icon}>{userName[0]}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem>{userName}</MenuItem>
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={Logout}>
                <LogoutIcon sx={{ marginRight: "5px" }} />
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);
};

export default ResponsiveAppBar;
