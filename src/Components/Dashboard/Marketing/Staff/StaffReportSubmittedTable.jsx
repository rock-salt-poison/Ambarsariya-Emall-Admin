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
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function StaffReportSubmittedTable({ data }) {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.summaries) {
      setReport(data.summaries);
    } else {
      setReport([]);
    }
  }, [data]);

  console.log(report);
  
  
  const handleRowClick = async (e, task_id, reporting_date, access_token, summary_group_id) =>{
    navigate(`?id=${task_id}&date=${reporting_date}&group=${summary_group_id}&token=${access_token}`);
  }

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
                <TableRow key={r.id || index} hover onClick={(e)=>{handleRowClick(e, data?.task_id, dayjs(data?.task_reporting_date)?.format('YYYY-MM-DD'), data?.access_token, r?.summary_group_id)}}>
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
