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
import { logout } from "../store/authSlice";

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
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // useEffect(() => {
  //   onSelectItem(menuItems[0].name);
  // }, []);

  useEffect(() => {
    if (menuItems.length > 0 && !selectedItem) {
      // Get first leaf item (actual clickable item)
      const getFirstLeaf = (items, parent = null) => {
        for (const item of items) {
          if (item.children && item.children.length > 0) {
            const leaf = getFirstLeaf(item.children, item.name);
            if (leaf) return leaf;
          } else {
            return { item, parent };
          }
        }
        return null;
      };
      const result = getFirstLeaf(menuItems);
      if (result && result.item) {
        setSelectedItem(result.item.name);
        onSelectItem({ 
          name: result.item.name, 
          type: result.item.type || null,
          parent: result.parent
        });
      } else if (menuItems[0]) {
        // Fallback to first item if no leaf found
        setSelectedItem(menuItems[0].name);
        onSelectItem({ 
          name: menuItems[0].name, 
          type: menuItems[0].type || null,
          parent: null
        });
      }
    }
  }, [menuItems, selectedItem, onSelectItem]);

  const handleItemClick = (item, parentName = null) => {
    setSelectedItem(item.name);
    // Pass item object with parent context for better navigation handling
    onSelectItem({ 
      name: item.name, 
      type: item.type || null,
      parent: parentName || null
    });
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
      dispatch(logout());
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
                    : handleItemClick(item, null)
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
                      onClick={() => handleItemClick(child, item.name)}
                      sx={{ pl: "32px !important" }}
                      className={
                        selectedItem === child.name ? "item active" : "item"
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
