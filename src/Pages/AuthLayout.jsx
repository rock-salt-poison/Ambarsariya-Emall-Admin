import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideBar from "../Components/SideBar";
import DashboardHeader from "../Components/Dashboard/DashboardHeader";
import { Box, CircularProgress } from "@mui/material";
// import HomeOutlined from "@mui/icons-material/HomeOutlined";
// import PersonOutline from '@mui/icons-material/PersonOutline';
import MailIcon from "@mui/icons-material/Mail";
import { get_userByToken } from "../API/expressAPI";
import { AssignmentOutlined, AssessmentOutlined, PersonOutline, HomeOutlined } from '@mui/icons-material';

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
      { name: "Dashboard", icon: <HomeOutlined /> },
      { name: "Admin", icon: <HomeOutlined /> },
      {
        name: "Sales", icon: <HomeOutlined />,
        children: []
      },
      {
        name: "Sales Staff",
        icon: <HomeOutlined />,
        children: [
        ],
      },
      { name: "IT Manager", icon: <HomeOutlined /> },
      { name: "Marketing", icon: <HomeOutlined /> ,
        children: [
          { name: "Marketing Dashboard", icon: <HomeOutlined /> },
          { name: "Assign Task", icon: <AssignmentOutlined /> },
          { name: "Staff Report", icon: <AssessmentOutlined /> },
        ],
      },
      {
        name: "Marketing Staff",
        icon: <HomeOutlined />,
        children: [
          { name: "My Tasks", icon: <AssignmentOutlined /> },
          { name: "Reports Submitted", icon: <AssessmentOutlined /> },
        ],
      },
      { name: "Designers", icon: <HomeOutlined /> },
      {
        name: "Accounts",
        icon: <HomeOutlined />,
        children: [
          { name: "Visitor", icon: <PersonOutline /> },
          { name: "Member", icon: <PersonOutline /> },
          { name: "Shop", icon: <PersonOutline /> },
          { name: "Merchant", icon: <PersonOutline /> },
        ],
      },
      {
        name: "Services",
        icon: <HomeOutlined />,
        children: [
          { name: "MoU", icon: <PersonOutline /> },
          { name: "Co-Helpers", icon: <PersonOutline /> },
          { name: "Pre-Paid / Post-Paid", icon: <PersonOutline /> },
          { name: "Discount Coupons", icon: <PersonOutline /> },
          { name: "Delivery", icon: <PersonOutline /> },
          { name: "Home Visit", icon: <PersonOutline /> },
          { name: "Pickup", icon: <PersonOutline /> },
          { name: "Take Away", icon: <PersonOutline /> },
        ],
      },
      {
        name: "Finance",
        icon: <HomeOutlined />,
        children: [
          { name: "B2B", icon: <PersonOutline /> },
          { name: "B2C", icon: <PersonOutline /> },
          { name: "C2C", icon: <PersonOutline /> },
          { name: "MoU", icon: <PersonOutline /> },
          { name: "Services", icon: <PersonOutline /> },
          { name: "Shops", icon: <PersonOutline /> },
        ],
      },
      { name: "Log Activity", icon: <HomeOutlined /> },
    ],
    Accounts: [
      { name: "Visitor", icon: <PersonOutline /> },
      { name: "Member", icon: <PersonOutline /> },
      { name: "Shop", icon: <PersonOutline /> },
      { name: "Merchant", icon: <PersonOutline /> },
    ],
    "Sales Manager": [
      { name: "Sales Dashboard", icon: <HomeOutlined /> },
      { name: "Assign Task", icon: <AssignmentOutlined /> },
      { name: "Staff Report", icon: <AssessmentOutlined /> },
    ],
    "Sales Staff": [
      { name: "My Tasks", icon: <AssignmentOutlined /> },
      { name: "Reports Submitted", icon: <AssessmentOutlined /> },
    ],
    "Marketing Manager": [
      { name: "Marketing Dashboard", icon: <HomeOutlined /> },
      { name: "Assign Task", icon: <AssignmentOutlined /> },
      { name: "Staff Report", icon: <AssessmentOutlined /> },
    ],
    "Marketing Staff": [
      { name: "My Tasks", icon: <AssignmentOutlined /> },
      { name: "Reports Submitted", icon: <AssessmentOutlined /> },
    ],
    "IT Manager": [
      { name: "Dashboard", icon: <HomeOutlined /> },
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
      const items = user?.user_type === 'marketing_staff' ? menuMap['Marketing Staff']: menuMap[user.department_name] || [];
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
      case "Marketing Dashboard":
        navigate("../marketing");
        break;
      case "Assign Task":
        navigate("../marketing/assign-task");
        break;
      case "Staff Report":
        navigate("../marketing/staff-report");
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
        navigate("../marketing-staff/my-tasks");
        break;
      case "Reports Submitted":
        navigate("../marketing-staff/reports-submitted");
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
        <DashboardHeader user={user?.user_type === 'marketing_staff' ? 'Marketing Staff': user?.department_name} />
        <Outlet context={{ selectedItem }} />
      </Box>
    </Box>
  );
};

export default AuthLayout;
