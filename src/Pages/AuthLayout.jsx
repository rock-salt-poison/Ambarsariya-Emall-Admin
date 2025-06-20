import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideBar from "../Components/SideBar";
import DashboardHeader from "../Components/Dashboard/DashboardHeader";
import { Box } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailIcon from "@mui/icons-material/Mail";

const AuthLayout = () => {
  const user = useSelector((state) => state.auth.adminAccessToken);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const getMenuItems = () => {
    const items = {
      Admin: [
        { name: "Dashboard", icon: <HomeOutlinedIcon /> },
        { name: "Admin", icon: <HomeOutlinedIcon /> },
        { name: "Sales", icon: <HomeOutlinedIcon /> },
        { name: "IT Manager", icon: <HomeOutlinedIcon /> },
        { name: "Marketing", icon: <HomeOutlinedIcon /> },
        { name: "Designers", icon: <HomeOutlinedIcon /> },
        {
          name: "Accounts",
          icon: <HomeOutlinedIcon />,
          children: [
            { name: "Visitor", icon: <PersonOutlineIcon /> },
            { name: "Member", icon: <PersonOutlineIcon /> },
            { name: "Shop", icon: <PersonOutlineIcon /> },
            { name: "Merchant", icon: <PersonOutlineIcon /> },
          ],
        },
        {
          name: "Services",
          icon: <HomeOutlinedIcon />,
          children: [
            { name: "MoU", icon: <PersonOutlineIcon /> },
            { name: "Co-Helpers", icon: <PersonOutlineIcon /> },
            { name: "Pre-Paid / Post-Paid", icon: <PersonOutlineIcon /> },
            { name: "Discount Coupons", icon: <PersonOutlineIcon /> },
            { name: "Delivery", icon: <PersonOutlineIcon /> },
            { name: "Home Visit", icon: <PersonOutlineIcon /> },
            { name: "Pickup", icon: <PersonOutlineIcon /> },
            { name: "Take Away", icon: <PersonOutlineIcon /> },
          ],
        },
        { name: "Finance", icon: <HomeOutlinedIcon /> },
        { name: "Log Activity", icon: <HomeOutlinedIcon /> },
      ],
      Accounts: [
        { name: "Visitor", icon: <PersonOutlineIcon /> },
        { name: "Member", icon: <PersonOutlineIcon /> },
        { name: "Shop", icon: <PersonOutlineIcon /> },
        { name: "Merchant", icon: <PersonOutlineIcon /> },
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
      } else if (selectedItem === "To-Do") {
        navigate("../todo");
      } else if (selectedItem === "Visitor") {
        navigate("../accounts/visitor");
      } else if (selectedItem === "Member") {
        navigate("../accounts/member");
      }else if (selectedItem === "Shop") {
        navigate("../accounts/shop");
      }else if (selectedItem === "Merchant") {
        navigate("../accounts/merchant");
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
