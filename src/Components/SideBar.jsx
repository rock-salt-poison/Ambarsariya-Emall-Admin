import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import mallIcon from "../Utils/images/gatelogo.webp";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MailIcon from "@mui/icons-material/Mail";
import { Typography } from "@mui/material";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  minWidth: drawerWidth,
  transition: theme.transitions.create("minWidth", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 10px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 10px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: "max-content",
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ onSelectItem, menuItems }) {
  const [open, setOpen] = React.useState(true);

  // const menuItems = [
  //   { name: "Dashboard", icon: <HomeOutlinedIcon /> },
  //   { name: "-", icon: <MailIcon /> },
  // ];

  const [selectedItem, setSelectedItem] = React.useState(menuItems[0].name);

  const handleItemClick = (item) => {
    setSelectedItem(item.name);
    onSelectItem(item.name);
  };

  React.useEffect(() => {
    onSelectItem(menuItems[0].name);
  }, []);

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={() => setOpen(!open)} className="iconButton">
          {open ? (
            <>
              <Box component="img" src={mallIcon} className="logo" />
              <Typography className="heading light">
                Ambarsariya Mall
              </Typography>
            </>
          ) : (
            <Box component="img" src={mallIcon} className="logo" />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => handleItemClick(item)}
              className={selectedItem === item.name ? "item active" : "item"}
              sx={{
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{ opacity: open ? 1 : 0 }}
                className="text"
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
