import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { useParams } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";

export default function ReceivableTable({ data = [], tab }) {
  const { user_type, token } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [tableHeader, setTableHeader] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
  const headers = [
    { label: "UNB", dropdown: true, options: ["Purchase To Supplier", "Supplier To Purchase"] },
    { label: "Message Header", dropdown: true, options: ["Invoice Order", "Delivery Order", "Return Order"] },
    { label: "Beginning of Message", dropdown: true, options: ["Description of Purchase", "Description of Shop", "Description of Service"] },
    { label: "DTM", dropdown: true, options: ["Issue Date", "Delivery Date"] },
    { label: "Buyer", dropdown: true, options: ["Member ID", "Walkin Customer"] },
    { label: "Supplier", dropdown: true, options: ["Shop ID", "Merchant ID"] },
    { label: "Shipping", dropdown: false },
    { label: "LIN Item Details", dropdown: true, options : ["Item ID", "Product ID", "Delivery ID", "Return ID"] },
    { label: "Quantity", dropdown: false },
    { label: "Price", dropdown: false },
  ];
  setTableHeader(headers);

  // Set first options as default selected for dropdowns
  const initialFilters = {};
  headers.forEach(header => {
    if (header.dropdown && header.options?.length) {
      initialFilters[header.label] = header.options[0]; // first one selected
    }
  });
  setFilters(initialFilters);
}, [user_type, token]);


  const handleFilterChange = (label, value) => {
    setFilters((prev) => ({ ...prev, [label]: value }));
  };

  const filteredData = data.filter((row) => {
    return tableHeader.every((header, index) => {
      if (header.dropdown && filters[header.label]) {
        const cellValue = row[header.label] || ""; // Adjust depending on your data structure
        return String(cellValue).includes(filters[header.label]);
      }
      return true;
    });
  });

  return (
    <Box className="col">
      {loading && (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeader?.map((header, i) => (
                <TableCell key={i}>{header.label}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              {tableHeader.map((header, i) => (
                <TableCell key={i}>
                  {header.dropdown ? (
                    <Select
                      size="small"
                      fullWidth
                      displayEmpty
                      value={filters[header.label] || ""}
                      onChange={(e) =>
                        handleFilterChange(header.label, e.target.value)
                      }
                      className="dropdown"
                    >
                      {header.options.map((opt, j) => (
                        <MenuItem key={j} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Typography fontWeight="bold">{header.label}</Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(filteredData.length > 0 ? filteredData : [null]).map((row, rowIndex) => (
              <TableRow hover key={rowIndex}>
                {tableHeader.map((header, colIndex) => (
                  <TableCell key={colIndex}>
                    {row ? row[header.label] ?? "-" : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}
