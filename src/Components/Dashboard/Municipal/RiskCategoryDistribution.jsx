import React, { useState } from "react";
import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField } from "@mui/material";
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
    <Box className="container" >
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
    <Box className="container" >
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

// Shared sample data for License Status (used in table + renewal rate calculations)
const licenseStatusSampleData = [
  {
    id: 1,
    domain: "Retailer",
    sector: "Textile and interiors",
    date_from: "02/06/2024",
    date_to: "02/06/2025",
    status: "Suspended",
    no_of_renewal: "5",
    total_shops: 10,
    pending_shops: 5,
  },
  {
    id: 2,
    domain: "Wholeseller",
    sector: "Textile and Purchase",
    date_from: "02/06/2025",
    date_to: "02/06/2026",
    status: "Expiring",
    no_of_renewal: "12",
    total_shops: 20,
    pending_shops: 8,
  },
  {
    id: 3,
    domain: "Daily Need",
    sector: "Milk products",
    date_from: "02/02/2026",
    date_to: "02/02/2027",
    status: "Active",
    no_of_renewal: "N.A",
    total_shops: 102,
    pending_shops: 13,
  },
];

// License Status Tab Content
function LicenseStatusContent() {
  const [licenseStatusData] = useState(licenseStatusSampleData);

  return <LicenseStatusTable data={licenseStatusData} />;
}

// KYC Approved Table (updated to sector-level view)
function KYCApprovedTable({ data }) {
  const tableHeader = [
    "Sector(s)(All)",
    "Total Count",
    "Max Auth",
    "E-mall (4)",
    "M.C.A (5)",
    "Micro-Finance (6)",
    "MoU (7)",
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
                  <TableCell>{row.sector_all}</TableCell>
                  <TableCell>{row.total_count}</TableCell>
                  <TableCell>{row.max_auth}</TableCell>
                  <TableCell>{row.e_mall_4}</TableCell>
                  <TableCell>{row.mca_5}</TableCell>
                  <TableCell>{row.micro_finance_6}</TableCell>
                  <TableCell>{row.mou_7}</TableCell>
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
// Combined Business Stability Table (matches screenshot)
function BusinessStabilityTable({ sectorData, subSectorSummary }) {
  const tableHeader = [
    "Sector(s)(all)",
    "Class A/B/C/D",
    "Total No of Shops/hawkers",
    "Total Revenue(last Month)",
    "Total Revenue(current Month)",
    "Current - Last",
  ];

  return (
    <Box className="container">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Business Stability Overview
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
            {/* Row 1 - All sectors */}
            <TableRow hover>
              <TableCell>{sectorData.sectors}</TableCell>
              <TableCell>{sectorData.class}</TableCell>
              <TableCell>{sectorData.total_no_of_shops}</TableCell>
              <TableCell>{sectorData.total_revenue_last_month}</TableCell>
              <TableCell>{sectorData.total_revenue_current_month}</TableCell>
              <TableCell>{sectorData.current_minus_last}</TableCell>
            </TableRow>

            {/* Row 2 - Sub Sector(s)(all) */}
            <TableRow hover>
              <TableCell>{subSectorSummary.label}</TableCell>
              <TableCell>{subSectorSummary.movable_immovable}</TableCell>
              <TableCell>{subSectorSummary.total_hawkers}</TableCell>
              <TableCell>{subSectorSummary.vendor_license_revenue}</TableCell>
              <TableCell>{subSectorSummary.platform_fees}</TableCell>
              <TableCell>{subSectorSummary.current_minus_last}</TableCell>
            </TableRow>

            {/* Row 3 - empty row as per screenshot */}
            <TableRow>
              <TableCell colSpan={tableHeader.length} />
            </TableRow>
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

// Shared sample data for KYC Approved (used in table + renewal rate calculations)
const kycApprovedSampleData = [
  {
    id: 1,
    sector_all: "All",
    total_count: 200,
    max_auth: 7,
    e_mall_4: 250,
    mca_5: 150,
    micro_finance_6: 100,
    mou_7: 50,
  },
];

// KYC Approved Tab Content
function KYCApprovedContent() {
  const [kycData] = useState(kycApprovedSampleData);
  
  return <KYCApprovedTable data={kycData} />;
}

// Business Stability Tab Content
function BusinessStabilityContent() {
  // Row 1 - All sectors
  const sectorData = {
    sectors: "All",
    class: "Class B",
    total_no_of_shops: 505,
    total_revenue_last_month: 500000,
    total_revenue_current_month: 550000,
    current_minus_last: 50000,
  };

  // Row 2 - Sub Sector(s)(all)
  const subSectorSummary = {
    label: "Sub Sector(s)(all)",
    movable_immovable: "Movable/Immovable",
    total_hawkers: 50,
    vendor_license_revenue: "Vendor License Revenue",
    platform_fees: "Platform fees/Conjuring with near by areas needs.",
    current_minus_last: 12000,
  };

  return (
    <Box className="">
      <BusinessStabilityTable
        sectorData={sectorData}
        subSectorSummary={subSectorSummary}
      />
    </Box>
  );
}

// Shared sample data for Inspection Clearance (used in table + renewal rate calculations)
const inspectionClearanceSampleData = [
  {
    id: 1,
    wards: "All",
    total_trade_and_vendor_license: 5000,
    total_vendor: 10000,
    certification_compliance_period: "Health and Safety",
    number_of_due_certification_for_inspection: 500,
  },
];

// Inspection clearance Tab Content
function InspectionClearanceContent() {
  const [inspectionClearanceData] = useState(inspectionClearanceSampleData);

  return <InspectionClearanceTable data={inspectionClearanceData} />;
}

// Renewal Rate Table
function RenewalRateTable({ data }) {
  const tableHeader = [
    "Payment Behaviour 40%",
    "License Status 20%",
    "KYC Approved 10%",
    "10 % Business Stability",
    "20 % Certification Clearance",
  ];

  const subHeader = [
    "Total Fine License + Total Utilities + Growth",
    "Active - (Pending + Expired)",
    "10% - Grievances%",
    "Sector(all) + Sub-sector(all)",
    "No of Certification / Vendor / Trade Re-issue",
  ];

  return (
    <Box className="container" >
      <Box className="col">
        <Table>
          <TableHead>
            <TableRow>
              {tableHeader.map((header, i) => (
                <TableCell key={i} sx={{ fontWeight: 600 }} colSpan={1}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="sub_header">
              {subHeader.map((subHeaderText, i) => (
                <TableCell key={i}>
                  {subHeaderText}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                      <Typography variant="body1">{row.payment_behaviour}</Typography>
                  </TableCell>
                  <TableCell>
                      <Typography variant="body1">{row.license_status}</Typography>
                  </TableCell>
                  <TableCell>
                      <Typography variant="body1">{row.kyc_approved}</Typography>
                  </TableCell>
                  <TableCell>
                      <Typography variant="body1">{row.business_stability}</Typography>
                  </TableCell>
                  <TableCell>
                      <Typography variant="body1">{row.certification_clearance}</Typography>
                  </TableCell>
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

// Renewal Rate Tab Content
function RenewalRateContent() {
  // --- Derive values from other tables' sample data ---

  // Payment Behavior 40%:
  // Fine license (₹2000) from PaymentBehaviorTable1 +
  // Total utilities fine (₹0) from PaymentBehaviorTable2 +
  // Growth (+₹200) from PaymentBehaviorTable3 (current_minus_last)
  const fineLicense = 2000;
  const utilitiesFine = 0;
  const paymentGrowth = 200;
  const paymentBehaviourValue = fineLicense + utilitiesFine + paymentGrowth; // 2200

  // License Status 20%:
  // From licenseStatusSampleData:
  // Total Active Shops - (Total Pending Shops + Total Expired Shops)
  const activeRow = licenseStatusSampleData.find((row) => row.status === "Active");
  const otherRows = licenseStatusSampleData.filter((row) => row.status === "Expiring");

  // Total Active Shops (from Active row's total_shops)
  const totalActiveShops = activeRow
    ? (typeof activeRow.total_shops === "number"
        ? activeRow.total_shops
        : Number(activeRow.total_shops) || 0)
    : 0;

  // Total Pending Shops (sum of all pending_shops from all rows)
  const totalPendingShops = licenseStatusSampleData.reduce((sum, row) => {
    const value =
      typeof row.pending_shops === "number"
        ? row.pending_shops
        : Number(row.pending_shops) || 0;
    return sum + value;
  }, 0);

  // Total Expired Shops (sum of total_shops from non-Active rows)
  const totalExpiredShops = otherRows.reduce((sum, row) => {
    const value =
      typeof row.total_shops === "number"
        ? row.total_shops
        : Number(row.total_shops) || 0;
    return sum + value;
  }, 0);

  // Calculate: Total Active Shops - (Total Pending Shops + Total Expired Shops)
  const licenseStatusValue = totalActiveShops - (totalPendingShops + totalExpiredShops);

  // KYC Approved 10%:
  // Grievances % = (E-mall (4) - M.C.A (5)) taken from KYC Approved table
  const kycRow = kycApprovedSampleData[0];
  const eMallValue =
    typeof kycRow.e_mall_4 === "number"
      ? kycRow.e_mall_4
      : Number(kycRow.e_mall_4) || 0;
  const mcaValue =
    typeof kycRow.mca_5 === "number"
      ? kycRow.mca_5
      : Number(kycRow.mca_5) || 0;
  const grievancesPercent = eMallValue - mcaValue;
  const kycApprovedNumeric = grievancesPercent - 10;
  const kycApprovedValue = `${kycApprovedNumeric}%`;

  // Business Stability 10%:
  // From BusinessStabilityContent:
  // Row1 (All sectors) current - last: 50000
  // Row2 (Sub Sector(s)(all)) current - last: 12000
  const sectorCurrentMinusLast = 50000;
  const subSectorCurrentMinusLast = 12000;
  const businessStabilityValue = sectorCurrentMinusLast + subSectorCurrentMinusLast; // 62000

  // 20% Certification Clearance:
  // From inspectionClearanceSampleData:
  // total_vendor (total vendor certifications) / number_of_due_certification_for_inspection
  const inspectionRow = inspectionClearanceSampleData[0];
  const totalVendorCertifications =
    typeof inspectionRow.total_vendor === "number"
      ? inspectionRow.total_vendor
      : Number(inspectionRow.total_vendor) || 0;
  const dueCertifications =
    typeof inspectionRow.number_of_due_certification_for_inspection === "number"
      ? inspectionRow.number_of_due_certification_for_inspection
      : Number(inspectionRow.number_of_due_certification_for_inspection) || 0;
  const certificationClearanceNumeric =
    dueCertifications > 0 ? totalVendorCertifications / dueCertifications : 0;
  const certificationClearanceValue = `${certificationClearanceNumeric}`;

  // Overall Renewal Rate:
  // Sum of the five derived components:
  // Payment Behaviour (40%) + License Status (20%) + KYC Approved (10%) +
  // Business Stability (10%) + Certification Clearance (20%)
  const overallRenewalRate =
    paymentBehaviourValue +
    licenseStatusValue +
    kycApprovedNumeric +
    businessStabilityValue +
    certificationClearanceNumeric;

  // --- Monthly Renewal Rate data (per month) ---
  // This is where real per-month data can be plugged in.
  // For now we model one month with the values you provided.
  const renewalRateMonthlySampleData = {
    "2024-01": {
      current: 2.97,
      last: 2.06,
    },
  };

  const [selectedMonth, setSelectedMonth] = useState("2024-01");

  const selectedMonthData =
    renewalRateMonthlySampleData[selectedMonth] || { current: 0, last: 0 };

  const currentRenewalRate = selectedMonthData.current; // per month
  const lastMonthRenewalRate = selectedMonthData.last; // per month
  const renewalGrowthRate =
    lastMonthRenewalRate > 0
      ? currentRenewalRate / lastMonthRenewalRate
      : 0;
  const renewalGrowthPercent = (renewalGrowthRate - 1) * 100;

  const renewalRateData = [
    {
      id: 1,
      payment_behaviour: `₹${paymentBehaviourValue}`,
      license_status: licenseStatusValue,
      kyc_approved: kycApprovedValue,
      business_stability: `₹${businessStabilityValue}`,
      certification_clearance: certificationClearanceValue,
    },
  ];

  return (
    <Box className="">
      <RenewalRateTable data={renewalRateData} />
      <Box className="container">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Renewal Rate
        </Typography>
        <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
          Payment Behaviour (40%) + License Status (20%) + KYC Approved (10%) + 10% Business Stability + 20% Certification Clearance
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>
          = {paymentBehaviourValue} + {licenseStatusValue} + {kycApprovedNumeric} + {businessStabilityValue} + {certificationClearanceNumeric} ={" "}
          {overallRenewalRate}
        </Typography>

        {/* Monthly Renewal Rate and Growth */}
        <Box sx={{ mt: 3 }}>
          <TextField
            type="month"
            label="Select Month"
            size="small"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            sx={{ mb: 2, maxWidth: 220 }}
            InputLabelProps={{ shrink: true }}
          />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Renewal Rate (Monthly)
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Choose the Month (Current)
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Current: {currentRenewalRate.toFixed(2)} / month
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
            Last Month Renewal Rate
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Last Month = {lastMonthRenewalRate.toFixed(2)} (Last Month)
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
            Growth Rate
          </Typography>
          <Typography variant="body2">
            Choose the Month (past/current) or Current Renewal Rate / Past renewal rate
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            {currentRenewalRate.toFixed(2)} / {lastMonthRenewalRate.toFixed(2)} ={" "}
            {renewalGrowthRate.toFixed(3)}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600 }}>
            Current : {renewalGrowthRate.toFixed(3)} / Month
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600 }}>
            {renewalGrowthPercent.toFixed(1)} % growth.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function RiskCategoryDistribution() {
  const { tab } = useParams();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Get title based on tab
  const getTitle = () => {
    if (!tab) return "Risk Category Distribution";
    
    switch (tab) {
      case "payment-behavior":
        return "Risk Category Distribution - Payment Behavior (40%)";
      case "license-status":
        return "Risk Category Distribution - License Status (20%)";
      case "kyc-approved":
        return "Risk Category Distribution - KYC Approved (10%)";
      case "business-stability":
        return "Risk Category Distribution - Business Stability (10%)";
      case "inspection-clearance":
        return "Risk Category Distribution - Inspection Clearance (20%)";
      case "renewal-rate":
        return "Risk Category Distribution - Renewal rate";
      default:
        return "Risk Category Distribution";
    }
  };

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
      case "renewal-rate":
        return <RenewalRateContent />;
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
        <BoxHeader title={getTitle()} />
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
