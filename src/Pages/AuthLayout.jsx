import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideBar from "../Components/SideBar";
import DashboardHeader from "../Components/Dashboard/DashboardHeader";
import { Box, CircularProgress } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailIcon from "@mui/icons-material/Mail";
import { get_userByToken } from "../API/expressAPI";

const AuthLayout = () => {
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // start with loading true
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  // Fetch user by token
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const resp = await get_userByToken(token);
          console.log(resp);
          
          if (resp?.user) {
            setUser(resp.user);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Menu items mapping
  const menuMap = {
    Admin: [
      { name: "Dashboard", icon: <HomeOutlinedIcon /> },
      { name: "Admin", icon: <HomeOutlinedIcon /> },
      {
        name: "Sales", icon: <HomeOutlinedIcon />,
        children: [
          { name: "Sales Dashboard", icon: <HomeOutlinedIcon /> },
          { name: "Assign Task", icon: <MailIcon /> },
          { name: "Staff Report", icon: <MailIcon /> },
        ],
      },
      {
        name: "Sales Staff",
        icon: <HomeOutlinedIcon />,
        children: [
          { name: "My Tasks", icon: <PersonOutlineIcon /> },
        ],
      },
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
      {
        name: "Finance",
        icon: <HomeOutlinedIcon />,
        children: [
          { name: "B2B", icon: <PersonOutlineIcon /> },
          { name: "B2C", icon: <PersonOutlineIcon /> },
          { name: "C2C", icon: <PersonOutlineIcon /> },
          { name: "MoU", icon: <PersonOutlineIcon /> },
          { name: "Services", icon: <PersonOutlineIcon /> },
          { name: "Shops", icon: <PersonOutlineIcon /> },
        ],
      },
      { name: "Log Activity", icon: <HomeOutlinedIcon /> },
    ],
    Accounts: [
      { name: "Visitor", icon: <PersonOutlineIcon /> },
      { name: "Member", icon: <PersonOutlineIcon /> },
      { name: "Shop", icon: <PersonOutlineIcon /> },
      { name: "Merchant", icon: <PersonOutlineIcon /> },
    ],
    "Sales Manager": [
      { name: "Sales Dashboard", icon: <HomeOutlinedIcon /> },
      { name: "Assign Task", icon: <MailIcon /> },
      { name: "Staff Report", icon: <MailIcon /> },
    ],
    "Sales Staff": [
      { name: "My Tasks", icon: <MailIcon /> },
    ],
    "IT Manager": [
      { name: "Dashboard", icon: <HomeOutlinedIcon /> },
      { name: "To-Do", icon: <MailIcon /> },
    ],
  };

  // Flatten menu items to get first leaf node
  const getLeafItems = (items) => {
    let leaves = [];
    items.forEach(item => {
      if (item.children) {
        leaves = leaves.concat(getLeafItems(item.children));
      } else {
        leaves.push(item);
      }
    });
    return leaves;
  };

  // Update menuItems when user changes
  useEffect(() => {
    if (user) {
      const items = user?.user_type === 'staff' ? menuMap['Sales Staff']: menuMap[user.department_name] || [];
      setMenuItems(items);

      // Set first leaf as default selected
      const leaves = getLeafItems(items);
      if (leaves.length > 0) {
        setSelectedItem(leaves[0].name);
      }
    }
  }, [user]);

  // Navigate when selectedItem changes
  useEffect(() => {
    if (!selectedItem) return;

    switch (selectedItem) {
      case "Dashboard":
        navigate("./");
        break;
      case "IT Manager":
      case "To-Do":
        navigate("../todo");
        break;
      case "Sales Dashboard":
        navigate("../sales");
        break;
      case "Assign Task":
        navigate("../sales/assign-task");
        break;
      case "Staff Report":
        navigate("../sales/staff-report");
        break;
      case "Visitor":
        navigate("../accounts/visitor");
        break;
      case "Member":
        navigate("../accounts/member");
        break;
      case "Shop":
        navigate("../accounts/shop");
        break;
      case "Merchant":
        navigate("../accounts/merchant");
        break;
      case "B2B":
        navigate("../finance/b2b");
        break;
      case "B2C":
        navigate("../finance/b2c");
        break;
      case "My Tasks":
        navigate("../sales-staff/my-tasks");
        break;
      default:
        break;
    }
  }, [selectedItem]);

  // Early return for unauthorized user
  if (!loading && !user) return <Navigate to="/login" replace />;

  const handleSelectItem = (item) => setSelectedItem(item);

  return (
    <Box className="dashboard_wrapper" sx={{ display: "flex" }}>
      {loading && (
        <Box className="loading" >
          <CircularProgress />
        </Box>
      )}
      <SideBar onSelectItem={handleSelectItem} menuItems={menuItems} />
      <Box component="main" className="main">
        <DashboardHeader user={user?.user_type === 'staff' ? 'Sales Staff': user?.department_name} />
        <Outlet context={{ selectedItem }} />
      </Box>
    </Box>
  );
};

export default AuthLayout;
