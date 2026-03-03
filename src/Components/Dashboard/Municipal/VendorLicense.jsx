import React, { useState } from "react";
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useParams, Navigate } from "react-router-dom";
import BoxHeader from "../DashboardContent/BoxHeader";
import CustomSnackbar from "../../CustomSnackbar";

// Reusable table component for Vendor License
function VendorLicenseTable({ data, status }) {
  const tableHeader = [
    "Shop No",
    "Type",
    "Category",
    'License fees',
    "Sub Sector or Category",
    "Location or Mobility",
  ];

  return (
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
              {data && data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.shop_no}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {row.type}
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {row.category}
                    </TableCell>
                    <TableCell>{row.license_fees}</TableCell>
                    <TableCell>{row.sub_sector}</TableCell>
                    <TableCell>{row.location}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                    No {status.toLowerCase()} records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
    </Box>
  );
}

// Table component for New Applications tab
function NewApplicationsTable({ data, status }) {
  const tableHeader = [
    "Shop No",
    "Sub Sector",
    "Type",
    "Location",
    "Authentication Level 5",
    "Allowed Time",
  ];

  return (
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
              {data && data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.shop_no}</TableCell>
                    <TableCell>{row.sub_sector}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {row.type}
                    </TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.authentication_level_5}</TableCell>
                    <TableCell>{row.allowed_time}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                    No {status.toLowerCase()} records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
    </Box>
  );
}

// Table component for Pending Approval tab
function PendingApprovalTable({ data, status }) {
  const tableHeader = [
    "Shop No",
    "Marketing Staff ID",
    "Sales Staff ID",
    "Surveillance & Clearance Staff ID",
    "Pass / Fail / Hold",
    "Renewal / Re-certification Grievances",
  ];

  return (
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
              {data && data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.shop_no}</TableCell>
                    <TableCell>{row.marketing_staff_id}</TableCell>
                    <TableCell>{row.sales_staff_id}</TableCell>
                    <TableCell>{row.surveillance_clearance_staff_id}</TableCell>
                    <TableCell>{row.pass_fail_hold}</TableCell>
                    <TableCell>{row.renewal_recertification_grievances}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                    No {status.toLowerCase()} records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
    </Box>
  );
}

// Table component for Approved tab
function ApprovedTable({ data, status }) {
  const tableHeader = [
    "Shop No",
    "Trade License ID",
    "Vendor License ID",
    "Regular Monitoring Date / Period",
    "Pass / Hold / Fine",
    "Fine Rupees",
  ];

  return (
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
              {data && data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.shop_no}</TableCell>
                    <TableCell>{row.trade_license_id}</TableCell>
                    <TableCell>{row.vendor_license_id}</TableCell>
                    <TableCell>{row.regular_monitoring_date_period}</TableCell>
                    <TableCell>{row.pass_hold_fine}</TableCell>
                    <TableCell>{row.fine_rupees}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                    No {status.toLowerCase()} records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
    </Box>
  );
}

function VendorLicense() {
  const { tab } = useParams();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Sample data for different tabs - replace with actual API calls
  const [vendorLicenseData] = useState([
    {
      id: 1,
      shop_no: "shop_1",
      type: "Immovable",
      category: "Trade",
      license_fees: 500,
      sub_sector: "Retail",
      location: "Ward No - 12 ASR - III",
    },
    {
      id: 2,
      shop_no: "shop_2",
      type: "Movable",
      category: "Hawkers",
      license_fees: 500,
      sub_sector: "Food Vendor",
      location: "Street Market Area",
    },
  ]);

  const [newApplicationsData] = useState([
    {
      id: 3,
      shop_no: "shop_3",
      sub_sector: "Retail",
      type: "Immovable",
      location: "Ward No - 12 ASR - III",
      authentication_level_5: "Level 5",
      allowed_time: "09:00 - 18:00",
    },
  ]);

  const [pendingApprovalData] = useState([
    {
      id: 4,
      shop_no: "shop_4",
      marketing_staff_id: "MKT-001",
      sales_staff_id: "SAL-002",
      surveillance_clearance_staff_id: "SCS-003",
      pass_fail_hold: "Hold",
      renewal_recertification_grievances: "Pending Review",
    },
  ]);

  const [approvedData] = useState([
    {
      id: 5,
      shop_no: "shop_5",
      trade_license_id: "TL-2024-005",
      vendor_license_id: "VL-2024-005",
      regular_monitoring_date_period: "2024-12-15 / Monthly",
      pass_hold_fine: "Pass",
      fine_rupees: "₹0",
    },
  ]);

  // Map route parameter to content
  const renderContent = () => {
    if (!tab) {
      // Default to first tab if no tab parameter
      return <Navigate to="./vendor-license" replace />;
    }

    switch (tab) {
      case "vendor-license":
        return <VendorLicenseTable data={vendorLicenseData} status="Vendor license" />;
      case "new-applications":
        return <NewApplicationsTable data={newApplicationsData} status="New Applications" />;
      case "pending-approval":
        return <PendingApprovalTable data={pendingApprovalData} status="Pending Approval" />;
      case "approved":
        return <ApprovedTable data={approvedData} status="Approved" />;
      default:
        return <Navigate to="./vendor-license" replace />;
    }
  };

  return (
    <Box className="body">
      {loading && (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}
      <Box className="content">
        <BoxHeader title="Vendor License & Renewal" />
        <Box className="body municipal_corporation">
          {renderContent()}
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
