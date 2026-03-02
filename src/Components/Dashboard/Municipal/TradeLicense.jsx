import React, { useState } from "react";
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import BoxHeader from "../DashboardContent/BoxHeader";
import CustomSnackbar from "../../CustomSnackbar";
import Tabs from "../DashboardContent/Tabs";

// Reusable table component for Trade License
function TradeLicenseTable({ data, status }) {
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

  return (
    <Box className="col">
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
                      {row.trade_detail}
                    </TableCell>
                    <TableCell>{row.trade_unit}</TableCell>
                    <TableCell>{row.trade_location}</TableCell>
                    <TableCell>{row.owner_details}</TableCell>
                    <TableCell>{row.license_no}</TableCell>
                    <TableCell>{row.commencement_date}</TableCell>
                    <TableCell>{row.license_renewal}</TableCell>
                    <TableCell>
                      {row.wallet_auto_debit}
                    </TableCell>
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

// Table component for Expiring this month tab
function ExpiringThisMonthTable({ data, status }) {
  const tableHeader = [
    "Shop No",
    "Trade License Exp Date",
    "Renewal Y/N",
    "Late Fee Charges",
    "Vendor License Exp Date",
    "Renewal Y/N",
    "Late Fees Charges",
  ];

  return (
    <Box className="col">
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
                    <TableCell>{row.trade_license_exp_date}</TableCell>
                    <TableCell>{row.trade_renewal_yn}</TableCell>
                    <TableCell>{row.trade_late_fee_charges}</TableCell>
                    <TableCell>{row.vendor_license_exp_date}</TableCell>
                    <TableCell>{row.vendor_renewal_yn}</TableCell>
                    <TableCell>{row.vendor_late_fees_charges}</TableCell>
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

// Table component for Regulatory control tab
function RegulatoryControlTable({ data, status }) {
  const tableHeader = [
    "Shop No",
    "Zoning Compliance",
    "Fire Safety and Health Regulations",
    "CCTV Camera Required",
    "Pollution Monitoring",
    "Risk Based Business Classification",
  ];

  return (
    <Box className="col">
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
                    <TableCell>{row.zoning_compliance}</TableCell>
                    <TableCell>{row.fire_safety_health_regulations}</TableCell>
                    <TableCell>{row.cctv_camera_required}</TableCell>
                    <TableCell>{row.pollution_monitoring}</TableCell>
                    <TableCell>{row.risk_based_business_classification}</TableCell>
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

function TradeLicense() {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Sample data for different tabs - replace with actual API calls
  const [tradeLicenseData] = useState([
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
    {
      id: 2,
      shop_no: "shop_2",
      trade_detail: "Movable",
      trade_unit: "Service Based",
      trade_location: "Ward No - 10 ASR - II",
      owner_details: "John Doe",
      license_no: "PB-TL-2024-002",
      commencement_date: "2024-02-20",
      license_renewal: "2025-02-20",
      wallet_auto_debit: "OFF",
    },
  ]);

  const [expiringThisMonthData] = useState([
    {
      id: 3,
      shop_no: "shop_3",
      trade_license_exp_date: "2025-01-15",
      trade_renewal_yn: "Y",
      trade_late_fee_charges: "₹500",
      vendor_license_exp_date: "2025-01-20",
      vendor_renewal_yn: "N",
      vendor_late_fees_charges: "₹0",
    },
  ]);

  const [regulatoryControlData] = useState([
    {
      id: 4,
      shop_no: "shop_4",
      zoning_compliance: "Compliant",
      fire_safety_health_regulations: "Passed",
      cctv_camera_required: "Yes",
      pollution_monitoring: "Active",
      risk_based_business_classification: "High Risk",
    },
  ]);

  const tabsData = [
    {
      id: 1,
      name: "Trade license",
      content: <TradeLicenseTable data={tradeLicenseData} status="Trade license" />,
    },
    {
      id: 2,
      name: "Expiring this month",
      content: <ExpiringThisMonthTable data={expiringThisMonthData} status="Expiring this month" />,
    },
    {
      id: 3,
      name: "Regulatory control",
      content: <RegulatoryControlTable data={regulatoryControlData} status="Regulatory control" />,
    },
  ];

  return (
    <Box className="body">
      {loading && (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}
      <Box className="content">
        <BoxHeader title="Trade License" />
        <Box className="body municipal_corporation">
          <Tabs data={tabsData} />
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
