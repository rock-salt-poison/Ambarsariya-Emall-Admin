import React, { useState, useEffect, useRef } from "react";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SideBar from "../Components/SideBar";
import DashboardHeader from "../Components/Dashboard/DashboardHeader";
import { Box, CircularProgress } from "@mui/material";
// import HomeOutlined from "@mui/icons-material/HomeOutlined";
// import PersonOutline from '@mui/icons-material/PersonOutline';
import MailIcon from "@mui/icons-material/Mail";
import { get_userByToken } from "../API/expressAPI";
import { AssignmentOutlined, AssessmentOutlined, PersonOutline, HomeOutlined,NoteAdd, Restore, DynamicForm, MiscellaneousServices } from '@mui/icons-material';


const AuthLayout = () => {
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // start with loading true
  const [selectedItem, setSelectedItem] = useState(null); // Can be string or object with {name, type, parent}
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isUserNavigation = useRef(false); // Track if navigation is from user click
  const isInitialMount = useRef(true); // Track initial mount

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
        children: [
          { name: "Sales Dashboard", icon: <HomeOutlined /> },
          { name: "Assign Sales Task", icon: <AssignmentOutlined /> },
          { name: "Sales Staff Report", icon: <AssessmentOutlined /> },
        ]
      },
      {
        name: "Sales Staff",
        icon: <HomeOutlined />,
        children: [
          { name: "My Tasks", icon: <AssignmentOutlined />, type:'sales' },
          { name: "Reports Submitted", icon: <AssessmentOutlined /> },
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
      {
        name: "Municipal",
        icon: <HomeOutlined />,
        children: [
          { name: "Trade License", icon: <NoteAdd /> },
          { name: "Vendor License & Renewal", icon: <Restore /> },
          { name: "Grievances & Redressal", icon: <DynamicForm /> },
          { name: "Services by Municipal Corporation", icon: <MiscellaneousServices /> },
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
      let items = [];
      if (user?.user_type === 'marketing_staff') {
        items = menuMap['Marketing Staff'];
      } else if (user?.user_type === 'sales_staff') {
        items = menuMap['Sales Staff'];
      } else {
        items = menuMap[user.department_name] || [];
      }
      setMenuItems(items);

      // Set first leaf as default selected
      const leaves = getLeafItems(items);
      if (leaves.length > 0) {
        setSelectedItem(leaves[0].name); // Set as string for default
      }
    }
  }, [user]);

  // Navigate when selectedItem changes (only if user explicitly clicked, not on initial load/refresh)
  useEffect(() => {
    if (!selectedItem || !user) return;

    // On initial mount, don't navigate - let the current route stay
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only navigate if user explicitly clicked on a menu item
    if (!isUserNavigation.current) {
      return;
    }

    // Reset the flag after checking
    isUserNavigation.current = false;

    // Extract item name and type if selectedItem is an object
    const itemName = typeof selectedItem === 'object' ? selectedItem.name : selectedItem;
    const itemType = typeof selectedItem === 'object' ? selectedItem.type : null;
    const itemParent = typeof selectedItem === 'object' ? selectedItem.parent : null;

    switch (itemName) {
      case "Dashboard":
        navigate("./");
        break;
      case "Admin":
        navigate("./");
        break;
      case "IT Manager":
      case "To-Do":
        navigate("../todo");
        break;
      case "Marketing Dashboard":
        navigate("../marketing");
        break;
      case "Sales Dashboard":
        navigate("../sales");
        break;
      case "Assign Task":
        // Check parent context to determine route
        if (itemParent === "Marketing" || itemParent === "Marketing Manager") {
          navigate("../marketing/assign-task");
        } else if (itemParent === "Sales" || itemParent === "Sales Manager") {
          navigate("../sales/assign-task");
        } else if (user.department_name === "Marketing Manager" || user.department_name === "Admin") {
          // Default to marketing if can't determine from context
          navigate("../marketing/assign-task");
        } else if (user.department_name === "Sales Manager") {
          navigate("../sales/assign-task");
        }
        break;
      case "Assign Sales Task":
        navigate("../sales/assign-task");
        break;
      case "Staff Report":
        // Check parent context to determine route
        if (itemParent === "Marketing" || itemParent === "Marketing Manager") {
          navigate("../marketing/staff-report");
        } else if (itemParent === "Sales" || itemParent === "Sales Manager") {
          navigate("../sales/staff-report");
        } else if (user.department_name === "Marketing Manager" || user.department_name === "Admin") {
          // Default to marketing if can't determine from context
          navigate("../marketing/staff-report");
        } else if (user.department_name === "Sales Manager") {
          navigate("../sales/staff-report");
        }
        break;
      case "Sales Staff Report":
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
      case "C2C":
        navigate("../finance/c2c");
        break;
      case "My Tasks":
        // Check item type or user type to determine correct route
        if (itemType === 'sales' || itemParent === 'Sales Staff') {
          navigate("../sales-staff/my-tasks");
        } else if (user.user_type === 'marketing_staff') {
          navigate("../marketing-staff/my-tasks");
        } else if (user.user_type === 'sales_staff' || user.department_name === "Sales Staff") {
          navigate("../sales-staff/my-tasks");
        } else {
          // Check if in menu context - look at menuItems to determine
          const salesStaffMenu = menuItems.find(item => item.name === "Sales Staff");
          const marketingStaffMenu = menuItems.find(item => item.name === "Marketing Staff");
          if (salesStaffMenu && salesStaffMenu.children && salesStaffMenu.children.some(child => child.name === "My Tasks")) {
            navigate("../sales-staff/my-tasks");
          } else if (marketingStaffMenu && marketingStaffMenu.children && marketingStaffMenu.children.some(child => child.name === "My Tasks")) {
            navigate("../marketing-staff/my-tasks");
          } else {
            // Default to marketing if can't determine
            navigate("../marketing-staff/my-tasks");
          }
        }
        break;
      case "Reports Submitted":
        // Check item type or user type to determine correct route
        if (itemType === 'sales' || itemParent === 'Sales Staff') {
          navigate("../sales-staff/reports-submitted");
        } else if (user.user_type === 'marketing_staff') {
          navigate("../marketing-staff/reports-submitted");
        } else if (user.user_type === 'sales_staff' || user.department_name === "Sales Staff") {
          navigate("../sales-staff/reports-submitted");
        } else {
          // Check if in menu context - look at menuItems to determine
          const salesStaffMenu = menuItems.find(item => item.name === "Sales Staff");
          const marketingStaffMenu = menuItems.find(item => item.name === "Marketing Staff");
          if (salesStaffMenu && salesStaffMenu.children && salesStaffMenu.children.some(child => child.name === "Reports Submitted")) {
            navigate("../sales-staff/reports-submitted");
          } else if (marketingStaffMenu && marketingStaffMenu.children && marketingStaffMenu.children.some(child => child.name === "Reports Submitted")) {
            navigate("../marketing-staff/reports-submitted");
          } else {
            // Default to marketing if can't determine
            navigate("../marketing-staff/reports-submitted");
          }
        }
        break;
      case "MoU":
        navigate("../services/mou");
        break;
      case "Co-Helpers":
        navigate("../services/co-helpers");
        break;
      case "Pre-Paid / Post-Paid":
        navigate("../services/prepaid-postpaid");
        break;
      case "Discount Coupons":
        navigate("../services/discount-coupons");
        break;
      case "Delivery":
        navigate("../services/delivery");
        break;
      case "Home Visit":
        navigate("../services/home-visit");
        break;
      case "Pickup":
        navigate("../services/pickup");
        break;
      case "Take Away":
        navigate("../services/take-away");
        break;
      case "Services":
        navigate("../finance/services");
        break;
      case "Shops":
        navigate("../finance/shops");
        break;
      case "Log Activity":
        navigate("../log-activity");
        break;
      case "Trade License":
        navigate("../municipal/trade-license");
        break;
      case "Vendor License & Renewal":
        navigate("../municipal/vendor-license");
        break;
      default:
        break;
    }
  }, [selectedItem, user, menuItems, navigate, location.pathname]);

  // Early return for unauthorized user
  if (!loading && !user) return <Navigate to="/login" replace />;

  const handleSelectItem = (item) => {
    // Mark that this is user-initiated navigation
    isUserNavigation.current = true;
    
    // If item is an object with name property, store both name and context
    // If item is just a string (legacy), store as string
    if (typeof item === 'object' && item.name) {
      setSelectedItem({ name: item.name, type: item.type, parent: item.parent });
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <Box className="dashboard_wrapper" sx={{ display: "flex" }}>
      {loading && (
        <Box className="loading" >
          <CircularProgress />
        </Box>
      )}
      <SideBar onSelectItem={handleSelectItem} menuItems={menuItems} />
      <Box component="main" className="main">
        <DashboardHeader user={
          user?.user_type === 'marketing_staff' ? 'Marketing Staff' : 
          user?.user_type === 'sales_staff' ? 'Sales Staff' : 
          user?.department_name
        } />
        <Outlet context={{ selectedItem }} />
      </Box>
    </Box>
  );
};

export default AuthLayout;
