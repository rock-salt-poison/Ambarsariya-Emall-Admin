import React, { useState } from "react";
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useParams, Navigate } from "react-router-dom";
import BoxHeader from "../DashboardContent/BoxHeader";
import CustomSnackbar from "../../CustomSnackbar";

// Table 1 for Payment Behavior - Vendor/Trade/Certification
function PaymentBehaviorTable1({ data }) {
  const tableHeader = [
    "Vendor / Trade / Certification",
    "Date To and From",
    "Pass / Hold / Fine",
    "Total Grievances",
    "Total Pass / Hold / Fine",
    "Total Fine",
  ];

  return (
    <Box className="container" sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Vendor / Trade / Certification
      </Typography>
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
                  <TableCell>{row.vendor_trade_certification}</TableCell>
                  <TableCell>{row.date_from} to {row.date_to}</TableCell>
                  <TableCell>{row.pass_hold_fine}</TableCell>
                  <TableCell>{row.total_grievances}</TableCell>
                  <TableCell>{row.total_pass_hold_fine}</TableCell>
                  <TableCell>{row.total_fine}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

// Table 2 for Payment Behavior - Utilities
function PaymentBehaviorTable2({ data }) {
  const tableHeader = [
    "Utilities",
    "Date To and From",
    "Pass / Hold / Fine",
    "Total Grievances",
    "Total Pass / Hold / Fine",
    "Total Fine",
  ];

  return (
    <Box className="container" sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Utilities
      </Typography>
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
                  <TableCell>{row.utilities}</TableCell>
                  <TableCell>{row.date_from} to {row.date_to}</TableCell>
                  <TableCell>{row.pass_hold_fine}</TableCell>
                  <TableCell>{row.total_grievances}</TableCell>
                  <TableCell>{row.total_pass_hold_fine}</TableCell>
                  <TableCell>{row.total_fine}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

// Table 3 for Payment Behavior - Commission
function PaymentBehaviorTable3({ data }) {
  const tableHeader = [
    "Choose Sector(s) / All Sectors",
    "2% Commission Sale (Total)",
    "2% Commission Purchase (Total)",
    "Last Month Commission",
    "Current Month Commission",
    "Current - Last (+) if(-)",
  ];

  return (
    <Box className="container">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Commission
      </Typography>
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
                  <TableCell>{row.sector}</TableCell>
                  <TableCell>{row.commission_sale_total}</TableCell>
                  <TableCell>{row.commission_purchase_total}</TableCell>
                  <TableCell>{row.last_month_commission}</TableCell>
                  <TableCell>{row.current_month_commission}</TableCell>
                  <TableCell>{row.current_minus_last}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

// Payment Behavior Tab Content (40%)
function PaymentBehaviorContent() {
  const [table1Data] = useState([
    {
      id: 1,
      vendor_trade_certification: "Vendor",
      date_from: "2024-01-01",
      date_to: "2024-01-31",
      pass_hold_fine: "Pass",
      total_grievances: 5,
      total_pass_hold_fine: "Pass: 3, Hold: 1, Fine: 1",
      total_fine: "₹2000",
    },
  ]);

  const [table2Data] = useState([
    {
      id: 1,
      utilities: "Electricity",
      date_from: "2024-01-01",
      date_to: "2024-01-31",
      pass_hold_fine: "Pass",
      total_grievances: 3,
      total_pass_hold_fine: "Pass: 2, Hold: 1",
      total_fine: "₹0",
    },
  ]);

  const [table3Data] = useState([
    {
      id: 1,
      sector: "All Sectors",
      commission_sale_total: "₹50000",
      commission_purchase_total: "₹50000",
      last_month_commission: "₹1000",
      current_month_commission: "₹1200",
      current_minus_last: "+₹200",
    },
  ]);

  return (
    <Box className="">
      <PaymentBehaviorTable1 data={table1Data} />
      <PaymentBehaviorTable2 data={table2Data} />
      <PaymentBehaviorTable3 data={table3Data} />
    </Box>
  );
}

// License Status Table
function LicenseStatusTable({ data }) {
  const tableHeader = [
    "Domain(s) / All",
    "Sector(s) / All",
    "Date From and To",
    "Active / Expiring / Suspended",
    "No of Renewal",
    "Total Shops",
    "Pending Shops",
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
                  <TableCell>{row.domain}</TableCell>
                  <TableCell>{row.sector}</TableCell>
                  <TableCell>{row.date_from} to {row.date_to}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.no_of_renewal}</TableCell>
                  <TableCell>{row.total_shops}</TableCell>
                  <TableCell>{row.pending_shops}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

// License Status Tab Content
function LicenseStatusContent() {
  const [licenseStatusData] = useState([
    {
      id: 1,
      domain: "All",
      sector: "All",
      date_from: "2024-01-01",
      date_to: "2024-12-31",
      status: "Active",
      no_of_renewal: 10,
      total_shops: 150,
      pending_shops: 5,
    },
  ]);

  return <LicenseStatusTable data={licenseStatusData} />;
}

// KYC Approved Table
function KYCApprovedTable({ data }) {
  const tableHeader = [
    "Shop / Merchant",
    "Authentication Level",
    "E-mall(4)",
    "M.C.A(5)",
    "Micro finance(6)",
    "Connect with Sales Mount",
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
                  <TableCell>{row.shop_merchant}</TableCell>
                  <TableCell>{row.authentication_level}</TableCell>
                  <TableCell>{row.e_mall_4}</TableCell>
                  <TableCell>{row.mca_5}</TableCell>
                  <TableCell>{row.micro_finance_6}</TableCell>
                  <TableCell>{row.connect_with_sales_mount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
// Table 1 for Business Stability 
function BusinessStabilityTable1({ data }) {
    const tableHeader = [
      "Sector(s)",
      "Class A/B/C/D",
      "Total No. of Shops",
      "Total Revenue (Last Month)",
      "Total Revenue (Current Month)",
      "Current - Last"
    ];
  
    return (
      <Box className="container" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Revenue by Sector and Class
        </Typography>
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
                    <TableCell>{row.sectors}</TableCell>
                    <TableCell>{row.class}</TableCell>
                    <TableCell>{row.total_no_of_shops}</TableCell>
                    <TableCell>₹{row.total_revenue_last_month}</TableCell>
                    <TableCell>₹{row.total_revenue_current_month}</TableCell>
                    <TableCell>₹{row.current_minus_last}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    );
  }

// Table 2 for Business Stability - Sub Sector
function BusinessStabilityTable2({ data }) {
  const tableHeader = [
    "Sub Sector(s)",
    "Movable/Immovable",
    "Total Hawkers",
    "Vendor License Revenue",
    "Platform Fees (Conjuring with Near by Areas Needs)",
  ];

  return (
    <Box className="container">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Sub Sector Analysis
      </Typography>
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
                  <TableCell>{row.sub_sector}</TableCell>
                  <TableCell>{row.movable_immovable}</TableCell>
                  <TableCell>{row.total_hawkers}</TableCell>
                  <TableCell>₹{row.vendor_license_revenue}</TableCell>
                  <TableCell>₹{row.platform_fees}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

// Inspection Clearance Table
function InspectionClearanceTable({ data }) {
    const tableHeader = [
      "Ward(s)",
      "Total Trade and Vendor License",
      "Total Vendor",
      "Certification Compliance Period",
      "No. of due certification for inspection",
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
                    <TableCell>{row.wards}</TableCell>
                    <TableCell>{row.total_trade_and_vendor_license}</TableCell>
                    <TableCell>{row.total_vendor}</TableCell>
                    <TableCell>{row.certification_compliance_period}</TableCell>
                    <TableCell>{row.number_of_due_certification_for_inspection}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableHeader.length} sx={{ textAlign: "center" }}>
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>
    );
  }

// KYC Approved Tab Content
function KYCApprovedContent() {
  const [kycData] = useState([
    {
        id: 1,
      shop_merchant: "Shop_1",
      authentication_level: "Level 5",
      e_mall_4: "Yes",
      mca_5: "Yes",
      micro_finance_6: "No",
      connect_with_sales_mount: "Connected",
    },
  ]);
  
  return <KYCApprovedTable data={kycData} />;
}

// Business Stability Tab Content
function BusinessStabilityContent() {
    const [businessStabilityData] = useState([
      {
        id: 1,
        sectors: "All",
        class: "A",
        total_no_of_shops: 505,
        total_revenue_last_month: 50000,
        total_revenue_current_month: 55000,
        current_minus_last: 5000,
      },
    ]);

    const [subSectorData] = useState([
      {
        id: 1,
        sub_sector: "Retail",
        movable_immovable: "Immovable",
        total_hawkers: 25,
        vendor_license_revenue: 15000,
        platform_fees: 5000,
      },
      {
        id: 2,
        sub_sector: "Food & Beverages",
        movable_immovable: "Movable",
        total_hawkers: 40,
        vendor_license_revenue: 20000,
        platform_fees: 8000,
      },
    ]);
  
    return (
      <Box className="">
        <BusinessStabilityTable1 data={businessStabilityData} />
        <BusinessStabilityTable2 data={subSectorData} />
      </Box>
    );
  }

  // Inspection clearance Tab Content
function InspectionClearanceContent() {
    const [inspectionClearanceData] = useState([
        {
        id: 1,
        wards: "All",
        total_trade_and_vendor_license: 12,
        total_vendor: 5,
        certification_compliance_period: "Health and Safety",
        number_of_due_certification_for_inspection: 20,
        },
    ]);

    return <InspectionClearanceTable data={inspectionClearanceData} />;
}
function RiskCategoryDistribution() {
  const { tab } = useParams();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Map route parameter to content
  const renderContent = () => {
    if (!tab) {
      // Default to first tab if no tab parameter
      return <Navigate to="./payment-behavior" replace />;
    }

    switch (tab) {
      case "payment-behavior":
        return <PaymentBehaviorContent />;
      case "license-status":
        return <LicenseStatusContent />;
      case "kyc-approved":
        return <KYCApprovedContent />;
      case "business-stability":
        return <BusinessStabilityContent />;
      case "inspection-clearance":
        return <InspectionClearanceContent />;
      default:
        return <Navigate to="./payment-behavior" replace />;
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
        <BoxHeader title="Risk Category Distribution" />
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

export default RiskCategoryDistribution;
