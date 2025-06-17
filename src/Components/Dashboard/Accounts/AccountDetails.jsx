import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import BoxHeader from "../DashboardContent/BoxHeader";
import { useParams, useSearchParams } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";
import { get_allUsers, get_discount_coupons, get_visitorData, getMemberData, getShopUserData } from "../../../API/expressAPI";
import Tabs from "../DashboardContent/Tabs";
import BreadCrumbs from "../DashboardContent/BreadCrumbs";
import AccountsTable from "./AccountsTable";

function AccountDetails() {
  const [data, setData] = useState(null);
  const [coupons, setCoupons] = useState();
  const { user_type, token } = useParams();
  const [searchParams] = useSearchParams();
    
  const visitor_id = searchParams.get('visitor-id'); 
  const [loading, setLoading] = useState(false);
  
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (user_type === 'visitor') {
        try {
          setLoading(true);
          const resp = await get_visitorData(token, visitor_id);
          if (resp?.valid) {
            setData(resp?.data);
          }
        } catch (e) {
          console.log(e);
          setSnackbar({ open: true, message: "Error fetching records" });
        }finally{
          setLoading(false);
        }
      }else if (user_type === 'member') {
        try {
          setLoading(true);
          const resp = await getMemberData(token);
          
          if (resp.length>0) {
            setData(resp);
          }
        } catch (e) {
          console.log(e);
          setSnackbar({ open: true, message: "Error fetching records" });
        } finally{
          setLoading(false);
        }
      }else if (user_type === 'shop') {
        try {
          setLoading(true);
          const resp = await getShopUserData(token);
          if (resp.length>0) {
            setData(resp);
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
        finally{
          setLoading(false);
        }
      }
    };
    fetchDetails();
  }, [user_type, token]);
  
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
      content: <AccountsTable data={data} tab={'profile'}/>,
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
      name: "E-shop",
      content:<AccountsTable data={data} tab={'book-eshop'}/>,
    }
  ];

  return (
    <Box className="body">
       {loading && <Box className="loading">
                <CircularProgress/>
              </Box>}
     <BreadCrumbs 
        main_page={`${user_type}s`} 
        redirectTo={`../accounts/${user_type}`}  
        subpage={user_type==='shop' ?data?.[0].business_name : data?.[0].name || data?.[0].full_name}
    />

      <Box className="content">
        <BoxHeader
          title={user_type==='shop' ?`Shop : ${data?.[0].business_name}` : data?.[0].name || data?.[0].full_name}
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