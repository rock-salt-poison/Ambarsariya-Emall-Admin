import React, { useState } from "react";
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import BoxHeader from "../DashboardContent/BoxHeader";
import CustomSnackbar from "../../CustomSnackbar";

function VendorLicense() {
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
      type: "Immovable",
      category: "Trade",
      sub_sector: "Retail",
      location: "Ward No - 12 ASR - III",
    },
    {
      id: 2,
      shop_no: "shop_2",
      type: "Movable",
      category: "Hawkers",
      sub_sector: "Food Vendor",
      location: "Street Market Area",
    },
  ]);

  const tableHeader = [
    "Shop No",
    "Type",
    "Category",
    "Sub Sector or Category",
    "Location or Mobility",
  ];

  return (
    <Box className="body">
      {loading && (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}
      <Box className="content">
        <BoxHeader title="Vendor License & Renewal" />
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
                          {row.type}
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {row.category}
                        </TableCell>
                        <TableCell>{row.sub_sector}</TableCell>
                        <TableCell>{row.location}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                        No vendor license records found
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

export default VendorLicense;
