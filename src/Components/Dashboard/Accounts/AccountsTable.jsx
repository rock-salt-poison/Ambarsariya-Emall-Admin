import React, { useEffect, useState } from "react";
import {
  Box,
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

export default function AccountsTable({ data, tab }) {
  const { user_type, token } = useParams();
  const navigate = useNavigate();

  const [tableHeader, setTableHeader] = useState([]);

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
    } else {
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
    } else {
      navigate(`${row.access_token}`);
    }
  };

  return (
    <Box className="col">
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
              ? data?.map((row) => (
                <TableRow
                  key={row.visitor_id}
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
              : user_type === "member" && token && tab ==='profile' && data ?
              Object.entries(data && data[0]).map(([key, value], index) => (
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
                  ? data?.map((row) => (
                    <TableRow
                      key={row.user_id}
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
                        <DeleteIcon />
                      </TableCell>
                    </TableRow>
                  ))
                  : user_type === "shop" && !token && !tab
                    ? data?.map((row) => (
                      <TableRow
                        key={row.shop_access_token}
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
                          <DeleteIcon />
                        </TableCell>
                      </TableRow>
                    ))
                    : user_type === "shop" &&
                      token && !tab ?
                      data?.map((row, rowIndex) =>
                        row.coupons?.map((coupon, couponIndex) => (
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
                      token && tab === 'book-eshop' &&
                      Object.entries(data[0]).map(([key, value], index) => (
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
                      ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
