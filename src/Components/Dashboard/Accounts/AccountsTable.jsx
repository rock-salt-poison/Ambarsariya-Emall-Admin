import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmationDialog from "../DashboardContent/ConfirmationDialog";
import CustomSnackbar from "../../CustomSnackbar";
import { delete_user } from "../../../API/expressAPI";

export default function AccountsTable({ data, tab }) {
  const { user_type, token } = useParams();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
  });

  const [tableHeader, setTableHeader] = useState([]);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  useEffect(() => {
    // Dynamically set table header based on user_type
    if (user_type === "visitor") {
      setTableHeader([
        "Name",
        "Phone No.",
        "Purpose",
        "Domain",
        "Sector",
        "Message",
      ]);
    } else if (user_type === "member") {
      if (token) {
        if (tab === 'profile') {
          setTableHeader([
            "Field",
            "Details",
            "",
            ""
          ]);
        }
      } else {
        setTableHeader([
          "Name",
          "Phone No.",
          "Email",
          "Address",
          "",
          ""
        ]);
      }
    } else if (user_type === "shop") {
      if (token) {
        if (tab === 'book-eshop') {
          setTableHeader([
            "Fields",
            "Details",
            "",
            "",
          ]);
        } else {
          setTableHeader([
            "S No.",
            "Coupon Type",
            "Coupon",
            "Description",
            "",
            "",
          ]);
        }
      } else {
        setTableHeader([
          "User Name",
          "Shop no",
          "Shop Name",
          "Phone No.",
          "Email",
          "Domain",
          "Sector",
          "Address",
          "",
          "",
        ]);
      }
    } else if (user_type === "merchant") {
      setTableHeader([
        "Merchant ID",
        "Shop User ID",
        "Member User ID",
        // "Member ID",
        "Shop No.",
        "Shop Phone No.",
        "Member Phone No.",
        "Shop Username",
        "Member Username",
        "Business Name"
      ]);
    }else {
      setTableHeader([]);
    }
    // Add additional conditions for other user types if needed
  }, [user_type, token]);

  const renderConditions = (conditions, couponType) => {
    // Find conditions based on their type
    const findCondition = (type) => conditions.find((cond) => cond.type === type)?.value || '';

    switch (couponType) {
      case 'retailer_upto': {
        const percentage = findCondition('percentage');
        const minimumOrder = findCondition('minimum_order');

        return (
          <Typography>{percentage}% off on Minimum order ₹ {minimumOrder} </Typography>
        );
      }

      case 'retailer_flat': {
        const percentage = findCondition('flat');
        const minimumOrder = findCondition('minimum_order');

        return (
          <Typography>Flat {percentage}% off on Minimum order ₹ {minimumOrder} </Typography>
        );
      }

      case 'retailer_freebies': {
        const buy = findCondition('buy');
        const get = findCondition('get');

        return (
          <Typography className="percent">Buy {buy} Get {get}</Typography>
        );
      }

      case 'loyalty_unlock': {
        const unlockValue = findCondition('unlock');
        const lastPurchaseAbove = findCondition('last_purchase_above');

        return (
          <Typography className="percent">{unlockValue}% off, Min last purchase ₹ {lastPurchaseAbove}</Typography>

        );
      }

      case 'loyalty_bonus': {
        const flatPercent = findCondition('flat_percent');

        return (
          <Typography className="percent">{flatPercent}% off</Typography>
        );
      }

      case 'loyalty_prepaid': {
        const pay = findCondition('pay');
        const get = findCondition('get');

        return (
          <Typography className="percent">Pay ₹ {pay} get ₹ {get}</Typography>
        );
      }

      case 'loyalty_by_customer': {
        const save = findCondition('save');

        return (
          <Typography className="percent">Save {save}%</Typography>

        );
      }

      case 'subscription_daily': {
        const percentOff = findCondition('percent_off');
        const subscriptionType = findCondition('subscription_daily') || 'Daily';

        return (
          <Typography className="percent">{subscriptionType} {percentOff}% off</Typography>
        );
      }

      case 'subscription_monthly': {
        const percentOff = findCondition('percent_off');
        const subscriptionType = findCondition('subscription_monthly') || 'Monthly';

        return (
          <Typography className="percent">{subscriptionType} {percentOff}% off</Typography>
        );
      }

      case 'subscription_weekly': {
        const percentOff = findCondition('percent_off');
        const subscriptionType = findCondition('subscription_weekly') || 'Weekly';

        return (
          <Typography className="percent">{subscriptionType} {percentOff}% off</Typography>
        );
      }

      case 'subscription_edit': {
        const percentOff = findCondition('percent_off');
        const subscriptionType = findCondition('subscription_edit') || 'Custom';

        return (
          <Typography className="percent">{percentOff}% off</Typography>
        );
      }

      case 'special_discount': {
        const requestValue = findCondition('request');

        return (
          <Typography className="text_1">Special discount: {requestValue}</Typography>
        );
      }

      case 'sale_for_stock_clearance': {
        const price = findCondition('price');
        const dateRange = findCondition('sale_for_stock_clearance_date_range');
        const sku_no = findCondition('sku_no');

        return (
          <>
            <Box className="discount_details">
              <Typography className="text_3">sale for stock clearance</Typography>
              <Typography className="text_3">{price}</Typography>
              <Typography className="text_3">Valid : {dateRange}</Typography>
              <Typography className="text_3">{sku_no}</Typography>
            </Box>
          </>
        );
      }

      case 'hot_sale': {
        const product_type = findCondition('product_type');
        const discounted_price = findCondition('price');
        const dateRange = findCondition('hot_sale_date_range');
        const sale_price = findCondition('sale_price');
        const show_price = findCondition('show_price');

        return (
          <>
            <Box className="discount_details">
              <Typography className="text_3">{product_type}</Typography>
              <Typography className="text_3">{show_price}</Typography>
              <Typography className="text_3">{sale_price}</Typography>
              <Typography className="text_3">{discounted_price}</Typography>
              <Typography className="text_3">Valid : {dateRange}</Typography>
            </Box>
          </>
        );
      }

      case 'festivals_sale': {
        const festivalName = findCondition('festival_name') || 'Festival';
        const dateRange = (findCondition('festivals_sale_date_range'));
        const offer = findCondition('offer');

        return (
          <>
            <Box className="discount_details">
              <Typography className="text_1">Festival: {festivalName}</Typography>
              <Typography className="text_3">Valid : {dateRange}</Typography>
              <Typography className="text_3">{offer}</Typography>
            </Box>
          </>
        );
      }

      default:
        return (

          <Typography >
            No details available for this coupon type.
          </Typography>
        );
    }
  };


  const handleClick = (e, row) => {
    if (user_type === "shop") {
      navigate(`${row.shop_access_token}`);
    } else if (user_type === "visitor") {
      navigate(`${row.access_token}?visitor-id=${row.visitor_id}`);
    } else {
      navigate(`${row.access_token}`);
    }
  };

  const handleDelete = async (e, row) => {
    e.stopPropagation();
    e.preventDefault();
    setDialogOpen(true);
    setSelectedRow(row);
  }


  const handleConfirmDelete = async () => {
    if(selectedRow){
        try{
          setLoading(true);
          const resp = await delete_user(selectedRow?.user_id);
          setTableData((prev) => prev.filter(row => row.user_id !== selectedRow.user_id));

          setSnackbar({ open: true, message: resp.message });
        }catch(e){
            setSnackbar({ open: true, message: 'Failed to remove the user' });
        }finally{
          setLoading(false);
        }
        
    }
    setDialogOpen(false);
  };

  
  return (
    <Box className="col">
      {loading && <Box className="loading">
        <CircularProgress/>
      </Box>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeader.length > 0 &&
                tableHeader.map((header, i) => (
                  <TableCell key={i}>{header}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {user_type === "visitor"
              ? tableData && tableData?.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={(e) => handleClick(e, row)}
                >
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {row.name}
                  </TableCell>
                  <TableCell>{row.phone_no}</TableCell>
                  <TableCell>{row.purpose}</TableCell>
                  <TableCell>{row.domain_name}</TableCell>
                  <TableCell>{row.sector_name}</TableCell>
                  <TableCell>{row.message}</TableCell>
                </TableRow>
              ))
              : user_type === "member" && token && tab ==='profile' && tableData.length>0 ?
              Object.entries(tableData && tableData?.[0])?.map(([key, value], index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textTransform: "capitalize", fontWeight: '600 !important' }}>{key.replace(/_/g, " ")}</TableCell>
                  <TableCell sx={{ maxWidth: '380px', whiteSpace: 'wrap !important', wordBreak: 'break-all' }}>
                    {Array.isArray(value) ? value.join(", ") : value?.toString() || "N/A"}
                  </TableCell>
                  <TableCell>
                    <EditIcon />
                  </TableCell>
                  <TableCell>
                    <DeleteIcon />
                  </TableCell>
                </TableRow>
              ))
                 : user_type === "member" && !token && !tab
                  ? tableData?.map((row, index) => (
                    <TableRow
                      key={index}
                      hover
                      onClick={(e) => handleClick(e, row)}
                    >
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {row.full_name}
                      </TableCell>
                      <TableCell>{row.phone_no_1}</TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.address}</TableCell>
                      <TableCell>
                        <EditIcon />
                      </TableCell>
                      <TableCell>
                        <DeleteIcon onClick = {(e) => handleDelete(e, row)}/>
                      </TableCell>
                    </TableRow>
                  ))
                  : user_type === "shop" && !token && !tab
                    ? tableData?.map((row, index) => (
                      <TableRow
                        key={index}
                        hover
                        onClick={(e) => handleClick(e, row)}
                      >
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {row.full_name}
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {row.shop_no}
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {row.business_name}
                        </TableCell>
                        <TableCell>{row.phone_no_1}</TableCell>
                        <TableCell>{row.username}</TableCell>
                        <TableCell>{row.domain_name}</TableCell>
                        <TableCell>{row.sector_name}</TableCell>
                        <TableCell>{row.address}</TableCell>
                        <TableCell>
                          <EditIcon />
                        </TableCell>
                        <TableCell>
                          <DeleteIcon onClick = {(e) => handleDelete(e, row)}/>
                        </TableCell>
                      </TableRow>
                    ))
                    : user_type === "shop" &&
                      token && !tab ?
                      tableData?.map((row, rowIndex) =>
                        row?.coupons?.map((coupon, couponIndex) => (
                          <TableRow key={coupon.coupon_id} hover>
                            <TableCell sx={{ textTransform: "capitalize" }}>
                              {rowIndex + 1}.{couponIndex + 1}
                            </TableCell>
                            <TableCell sx={{ textTransform: "capitalize" }}>
                              {row.discount_category}
                            </TableCell>
                            <TableCell sx={{ textTransform: "capitalize" }}>
                              {coupon.coupon_type.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell>{renderConditions(coupon.conditions, coupon.coupon_type)}</TableCell>
                            <TableCell>
                              <EditIcon />
                            </TableCell>
                            <TableCell>
                              <DeleteIcon />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : user_type === "shop" &&
                      token && tab === 'book-eshop' && tableData.length>0 ?
                      Object.entries(tableData?.[0])?.map(([key, value], index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ textTransform: "capitalize", fontWeight: '600 !important' }}>{key.replace(/_/g, " ")}</TableCell>
                          <TableCell sx={{ maxWidth: '380px', whiteSpace: 'wrap !important', wordBreak: 'break-all' }}>
                            {Array.isArray(value) ? value.join(", ") : value?.toString() || "N/A"}
                          </TableCell>
                          <TableCell>
                            <EditIcon />
                          </TableCell>
                          <TableCell>
                            <DeleteIcon />
                          </TableCell>
                        </TableRow>
                      )): user_type === "merchant"
              && tableData && tableData?.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={(e) => handleClick(e, row)}
                >
                  <TableCell>{row.merchant_id || '-'}</TableCell>
                  <TableCell>
                    {row.shop_user_id}
                  </TableCell>
                  <TableCell>{row.member_user_id}</TableCell>
                  <TableCell>{row.shop_no}</TableCell>
                  <TableCell>{row.shop_phone_no}</TableCell>
                  <TableCell>{row.member_phone_no}</TableCell>
                  <TableCell>{row.shop_username}</TableCell>
                  <TableCell>{row.member_username}</TableCell>
                  <TableCell>{row.business_name}</TableCell>
                </TableRow>
              ))
              }
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onConfirm={handleConfirmDelete}
              title="Delete User"
              message="Are you sure you want to delete this user?"
            />
            <CustomSnackbar
                    open={snackbar.open}
                    handleClose={() => setSnackbar({ ...snackbar, open: false })}
                    message={snackbar.message}
                    severity={snackbar.severity}
                />
    </Box>
  );
}
