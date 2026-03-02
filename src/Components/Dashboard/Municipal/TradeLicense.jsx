import React, { useState } from "react";
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Switch, Typography } from "@mui/material";
import BoxHeader from "../DashboardContent/BoxHeader";
import CustomSnackbar from "../../CustomSnackbar";

function TradeLicense() {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Sample data - replace with actual API call
  const [tableData, setTableData] = useState([
    {
      id: 1,
      shop_no: "shop_1",
      trade_detail: "Immovable",
      trade_unit: "Goods Based Services",
      trade_location: "Ward No - 12 ASR - III",
      owner_details: "SPOC",
      license_no: "PB-TL-2024-001",
      commencement_date: "2024-01-15",
      license_renewal: "2025-01-15",
      wallet_auto_debit: "ON",
    },
  ]);

  const tableHeader = [
    "Shop No",
    "Trade Detail",
    "Trade Unit",
    "Trade Location",
    "Owner Details",
    "License No",
    "Commencement Date",
    "License Renewal",
    "Wallet Auto Debit",
  ];

  const handleWalletToggle = (id) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, wallet_auto_debit: !item.wallet_auto_debit }
          : item
      )
    );
    // TODO: Add API call to update wallet auto debit status
  };

  return (
    <Box className="body">
      {loading && (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}
      <Box className="content">
        <BoxHeader title="Trade License"  />
        <Box className="col">
          <Box className="container">
            <Box className="col">
              <Table>
                <TableHead>
                  <TableRow>
                    {tableHeader.map((header, i) => (
                      <TableCell key={i}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.length > 0 ? (
                    tableData.map((row, index) => (
                      <TableRow key={row.id} hover>
                        <TableCell>{row.shop_no}</TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {row.trade_detail}
                        </TableCell>
                        <TableCell>{row.trade_unit}</TableCell>
                        <TableCell>{row.trade_location}</TableCell>
                        <TableCell>{row.owner_details}</TableCell>
                        <TableCell>{row.license_no}</TableCell>
                        <TableCell>{row.commencement_date}</TableCell>
                        <TableCell>{row.license_renewal}</TableCell>
                        <TableCell>
                        {row.wallet_auto_debit }
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                        No trade license records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Box>
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

export default TradeLicense;
