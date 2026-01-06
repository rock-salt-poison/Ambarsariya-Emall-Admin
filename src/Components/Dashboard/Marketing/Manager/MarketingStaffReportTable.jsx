import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function MarketingStaffReportTable({ data }) {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.summaries) {
      setReport(data.summaries);
    } else {
      setReport([]);
    }
  }, [data]);

  return (
    <>
      {loading && (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}

      <Box className="col">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Shop Name</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell>Sector</TableCell>
              <TableCell>Summary Type</TableCell>
              <TableCell>Summary Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {report.length > 0 ? (
              report.map((r, index) => (
                <TableRow key={r.id || index} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {r.shop_name || "-"}
                  </TableCell>
                  <TableCell>{r.shop_domain || "-"}</TableCell>
                  <TableCell>{r.shop_sector || "-"}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {r.summary_type}
                  </TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {r.status}
                  </TableCell>
                  <TableCell>{r.action || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                  No report submitted
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
