import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import BoxHeader from "../DashboardContent/BoxHeader";
import { useParams } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";
import { get_allUsers, get_discount_coupons, get_visitorData, getMemberData, getShopUserData } from "../../../API/expressAPI";
import Tabs from "../DashboardContent/Tabs";
import BreadCrumbs from "../DashboardContent/BreadCrumbs";
import AccountsTable from "./AccountsTable";

function AccountDetails() {
  const [data, setData] = useState(null);
  const [coupons, setCoupons] = useState();
  const { user_type, token } = useParams();
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (user_type === 'visitor') {
        try {
          const resp = await get_visitorData(token);
          if (resp.valid) {
            setData(resp?.data[0]);
          }
        } catch (e) {
          console.log(e);
          setSnackbar({ open: true, message: "Error fetching records" });
        }
      }else if (user_type === 'member') {
        try {
          const resp = await getMemberData(token);
          if (resp.length>0) {
            setData(resp[0]);
          }
        } catch (e) {
          console.log(e);
          setSnackbar({ open: true, message: "Error fetching records" });
        }
      }else if (user_type === 'shop') {
        try {
          const resp = await getShopUserData(token);
          if (resp.length>0) {
            setData(resp[0]);
            const coupons = await get_discount_coupons(resp[0].shop_no);
            if(coupons.valid){
                if(coupons.data.length>0){
                    setCoupons(coupons.data)
                }
            }
          }
        } catch (e) {
          console.log(e);
          setSnackbar({ open: true, message: "Error fetching records" });
        }
      }
    };
    fetchDetails();
  }, [user_type]);
  
  const visitorData = [
    {
      id: 1,
      name: "Viewer",
      content: '',
    },
    {
      id: 2,
      name: "Shopping",
      content:'',
    },
    {
        id: 3,
        name: "Avail Discounts",
        content:'',
    },
    {
        id: 4,
        name: "Limited Services of E-Mall",
        content:'',
      },
  ];
  const memberData = [
    {
      id: 1,
      name: "Profile",
      content: '',
    },
    {
      id: 2,
      name: "Sell",
      content:'',
    },
    {
        id: 3,
        name: "Serve",
        content:'',
    },
    {
        id: 4,
        name: "Socialize",
        content:'',
      },
  ];
  const shopData = [
    {
      id: 1,
      name: "Discount Coupons",
      content: <AccountsTable data={coupons}/>,
    },
    {
      id: 2,
      name: "Book E-shop",
      content:'',
    },
    {
        id: 3,
        name: "E-shop",
        content:'',
    },
  ];

  return (
    <Box className="body">
     <BreadCrumbs 
        main_page={`${user_type}s`} 
        redirectTo={`../accounts/${user_type}`}  
        subpage={data?.name || data?.full_name}
    />

      <Box className="content">
        <BoxHeader
          title={data?.name || data?.full_name}
          searchField={false}
        />
        <Box className="body">
            <Tabs data={user_type ==='visitor' ? visitorData : user_type === 'member' ? memberData : user_type==='shop' && shopData} />
        </Box>
      </Box>
      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}

export default AccountDetails