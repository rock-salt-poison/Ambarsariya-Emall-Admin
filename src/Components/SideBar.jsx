import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MailIcon from "@mui/icons-material/Mail";
import ListItemText from "@mui/material/ListItemText";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Typography from "@mui/material/Typography";
import mallIcon from "../Utils/images/gatelogo.webp";
import CustomSnackbar from "./CustomSnackbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearTokens } from "../store/authSlice";

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
  const [open, setOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(menuItems[0].name);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    onSelectItem(menuItems[0].name);
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item.name);
    onSelectItem(item.name);
  };

  const handleExpandToggle = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleLogout = () => {
    setSnackbar({
      open: true,
      message: "Logout successful",
      severity: "success",
    });

    setTimeout(() => {
      dispatch(clearTokens());
      localStorage.removeItem("token");
      navigate("../login");
    }, 2000);
  };

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
          <React.Fragment key={item.name}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  item.children
                    ? handleExpandToggle(item.name)
                    : handleItemClick(item)
                }
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
                  {item.icon || <HomeOutlinedIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{ opacity: open ? 1 : 0 }}
                  className="text"
                />
                {item.children && (
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleExpandToggle(item.name)}
                  >
                    {expandedItems[item.name] ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                )}
              </ListItemButton>
            </ListItem>
            {item.children && expandedItems[item.name] && (
              <List component="div" disablePadding>
                {item.children.map((child) => (
                  <ListItem key={child.name} disablePadding>
                    <ListItemButton
                      onClick={() => handleItemClick(child)}
                      sx={{ pl: "32px !important" }}
                      className={
                        selectedItem === item.name ? "item active" : "item"
                      }
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          ml: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {child.icon || <MailIcon />}
                      </ListItemIcon>
                      <ListItemText primary={child.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            className="item logout"
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
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{ opacity: open ? 1 : 0 }}
              className="text"
            />
          </ListItemButton>
        </ListItem>
      </List>
      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Drawer>
  );
}
