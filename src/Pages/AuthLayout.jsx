import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideBar from "../Components/SideBar";
import DashboardHeader from "../Components/Dashboard/DashboardHeader";
import { Box, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MailIcon from "@mui/icons-material/Mail";
import DashboardMainContent from "../Components/Dashboard/Admin/DashboardMainContent"; // Assuming this exists
import ToDo from "../Components/Dashboard/ITManager/ToDo"; // Assuming this exists

const AuthLayout = () => {
  const user = useSelector((state) => state.auth.adminAccessToken);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const getMenuItems = () => {
    const items = {
      Admin: [{ name: "Dashboard", icon: <HomeOutlinedIcon /> },
        { name: "Admin", icon: <HomeOutlinedIcon /> },
        { name: "Sales", icon: <HomeOutlinedIcon /> },
        { name: "IT Manager", icon: <HomeOutlinedIcon /> },
        { name: "Marketing", icon: <HomeOutlinedIcon /> },
        { name: "Designers", icon: <HomeOutlinedIcon /> },
        { name: "Accounts", icon: <HomeOutlinedIcon /> },
        { name: "Finance", icon: <HomeOutlinedIcon /> },
        { name: "Log Activity", icon: <HomeOutlinedIcon /> },
      ],
      "IT Manager": [
        { name: "Dashboard", icon: <HomeOutlinedIcon /> },
        { name: "To-Do", icon: <MailIcon /> },
      ],
    };
    return items[user] || [];
  };

  const menuItems = getMenuItems();

  // UseEffect to set default selectedItem and trigger navigation
  useEffect(() => {
    if (!selectedItem && menuItems.length > 0) {
      setSelectedItem(menuItems[0].name);
    }
  }, [menuItems, selectedItem]);

  useEffect(() => {
    // Make sure we don't call navigate until selectedItem is set
    if (selectedItem) {
      if (selectedItem === "Dashboard") {
        navigate("./");
      } else if (selectedItem === "IT Manager") {
        navigate("../todo");
      }else if (selectedItem === "To-Do") {
        navigate("../todo");
      }else if (selectedItem === "Accounts") {
        navigate("../accounts");
      }
    }
  }, [selectedItem]);

  // Early return for unauthorized user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <Box className="dashboard_wrapper" sx={{ display: "flex" }}>
      <SideBar onSelectItem={handleSelectItem} menuItems={menuItems} />
      <Box component="main" className="main">
        <DashboardHeader user={user} />
        {/* This will render the child routes */}
        <Outlet context={{ selectedItem }} />
      </Box>
    </Box>
  );
};

export default AuthLayout;
