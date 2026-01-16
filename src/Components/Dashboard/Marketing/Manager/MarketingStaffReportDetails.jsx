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
  Paper,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import BoxHeader from "../../../Dashboard/DashboardContent/BoxHeader";
import { get_marketing_staff_report_details_by_task_report_id } from "../../../../API/expressAPI";
import dayjs from "dayjs";

export default function MarketingStaffReportDetails() {
  const { task_report_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await get_marketing_staff_report_details_by_task_report_id(task_report_id);
        setData(response);
      } catch (err) {
        console.error("Error fetching report details:", err);
        setError("Failed to fetch report details");
      } finally {
        setLoading(false);
      }
    };

    if (task_report_id) {
      fetchData();
    }
  }, [task_report_id]);

  const formatActionsDetail = (action, summaryType) => {
    if (!action || typeof action !== 'object') {
      return "-";
    }
    
    // Determine which action array to use based on summary type
    let actionArray = [];
    if (summaryType === "Confirm Summary" && action.confirm_action) {
      actionArray = action.confirm_action;
    } else if (summaryType === "Client Summary" && action.client_action) {
      actionArray = action.client_action;
    } else if (summaryType === "Capture Summary" && action.capture_action) {
      actionArray = action.capture_action;
    } else {
      // Fallback: get the first array value from the action object
      const keys = Object.keys(action);
      if (keys.length > 0 && Array.isArray(action[keys[0]])) {
        actionArray = action[keys[0]];
      }
    }
    
    if (actionArray.length === 0) {
      return "-";
    }
    
    return (
      <Box>
        {actionArray.map((actionItem, idx) => {
          const actionValue = typeof actionItem === 'object' ? actionItem.action : actionItem;
          const comment = typeof actionItem === 'object' ? actionItem.comment : null;
          const date = typeof actionItem === 'object' ? actionItem.date : null;
          const status = typeof actionItem === 'object' ? actionItem.status : null;
          
          return (
            <Box key={idx} sx={{ mb: 1, pb: 1, borderBottom: idx < actionArray.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Action: {actionValue || "-"}
              </Typography>
              {status && (
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85em', mt: 0.5, textTransform: 'capitalize' }}>
                  Status: {status}
                </Typography>
              )}
              {date && (
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85em', mt: 0.5 }}>
                  Date: {dayjs(date).format("YYYY-MM-DD HH:mm")}
                </Typography>
              )}
              {comment && (
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85em', mt: 0.5 }}>
                  Comment: {comment}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box className="body">
        <Box className="content">
          <BoxHeader
            title="Report Details"
            backIcon={true}
            handleBackClick={-1}
          />
          <Box className="loading">
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box className="body">
        <Box className="content">
          <BoxHeader
            title="Report Details"
            backIcon={true}
            handleBackClick={() => navigate(-1)}
          />
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="error">{error || "No data found"}</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="body">
      <Box className="content">
        <BoxHeader
          title="Report Details"
          backIcon={true}
          handleBackClick={-1}
        />
          {/* Staff Assigned Task */}
          {data.staff_task && (
          <Box className="container">
              <Typography className="table_heading">
                Staff Assigned Task
              </Typography>
            <Box className="col">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Field</strong></TableCell>
                    <TableCell><strong>Value</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell className="bold">Assigned Task</TableCell>
                    <TableCell >{data.staff_task.assigned_task || "-"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell className="bold">Start Date</TableCell>
                    <TableCell>
                      {data.staff_task.start_date
                        ? dayjs(data.staff_task.start_date).format("YYYY-MM-DD")
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell className="bold">End Date</TableCell>
                    <TableCell>
                      {data.staff_task.end_date
                        ? dayjs(data.staff_task.end_date).format("YYYY-MM-DD")
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell className="bold">Assigned Area</TableCell>
                    <TableCell>
                      <ol>
                      {Array.isArray(data.staff_task.assign_area)
                        ? data.staff_task.assign_area.map((a, idx) => (
                            <li key={idx}>
                              {typeof a === 'object' ? a.formatted_address ? a.formatted_address :  a.description : a}
                            </li>
                          ))
                        : data.staff_task.assign_area || "-"}
                        </ol>
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell className="bold">Approx. Shops</TableCell>
                    <TableCell>{data.staff_task.approx_shops || "-"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell className="bold">Approx. Offices</TableCell>
                    <TableCell>{data.staff_task.approx_offices || "-"}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell className="bold">Approx. Hawkers</TableCell>
                    <TableCell>{data.staff_task.approx_hawkers || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            </Box>
          )}

          {/* Task Report Details */}
          {data.task_report_details && (
            <>
              <Box className="container">
                <Typography className="table_heading">
                  Task Report Details
                </Typography>
                <Box className="col">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Field</strong></TableCell>
                        <TableCell><strong>Value</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow hover>
                        <TableCell className="bold">Task Reporting Date</TableCell>
                        <TableCell>
                          {data.task_report_details.task_reporting_date
                            ? dayjs(data.task_report_details.task_reporting_date).format("YYYY-MM-DD")
                            : "-"}
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className="bold">Visits</TableCell>
                        <TableCell>{data.task_report_details.visits || 0}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className="bold">Joined</TableCell>
                        <TableCell>{data.task_report_details.joined || 0}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className="bold">In Pipeline</TableCell>
                        <TableCell>{data.task_report_details.in_pipeline || 0}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Box>

              {/* Daily Summary Table */}
              <Box className="container">
                <Typography className="table_heading">
                  Daily Summary
                </Typography>
                <Box className="col">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Field</strong></TableCell>
                        <TableCell><strong>Value</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow hover>
                        <TableCell className="bold">Daily Leads Summary</TableCell>
                        <TableCell>{data.task_report_details.daily_leads_summary || 0}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className="bold">Daily Client Summary</TableCell>
                        <TableCell>{data.task_report_details.daily_client_summary || 0}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className="bold">Daily Capture Summary</TableCell>
                        <TableCell>{data.task_report_details.daily_capture_summary || 0}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className="bold">Daily Confirmation</TableCell>
                        <TableCell>{data.task_report_details.daily_confirmation || 0}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Box>

              {/* Total Summary Table */}
              <Box className="container">
                <Typography className="table_heading">
                  Total Summary
                </Typography>
                <Box className="col">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Field</strong></TableCell>
                        <TableCell><strong>Value</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow hover>
                        <TableCell className="bold">Total Leads Summary</TableCell>
                        <TableCell>{data.task_report_details.total_leads_summary || 0}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className="bold">Total Client Summary</TableCell>
                        <TableCell>{data.task_report_details.total_client_summary || 0}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className="bold">Total Capture Summary</TableCell>
                        <TableCell>{data.task_report_details.total_capture_summary || 0}</TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell className="bold">Total Confirmation</TableCell>
                        <TableCell>{data.task_report_details.total_confirmation || 0}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </>
          )}

          {/* Task Summaries */}
          {data.task_summaries && data.task_summaries.length > 0 && (
          <Box className="container">
              <Typography className="table_heading">
                Task Summaries
              </Typography>
            <Box className="col">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S. No.</TableCell>
                    <TableCell>Summary Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Shop Name</TableCell>
                    <TableCell>Domain</TableCell>
                    <TableCell>Sector</TableCell>
                    <TableCell sx={{ minWidth: 300 }}>Actions </TableCell>
                    <TableCell>Shop No</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.task_summaries.map((summary,index) => {
                    // Format summary type with group number
                    const summaryType = summary.summary_type || "";
                    const groupId = summary.summary_group_id || "";
                    const formattedSummaryType = summaryType && groupId 
                      ? `${summaryType} ${groupId}` 
                      : summaryType || "-";
                    
                    return (
                    <TableRow key={summary.id} hover>
                      <TableCell>{index+1}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {formattedSummaryType}
                      </TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {summary.status || "-"}
                      </TableCell>
                      <TableCell>{summary.name || "-"}</TableCell>
                      <TableCell>{summary.phone || "-"}</TableCell>
                      <TableCell>{summary.email || "-"}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {summary.shop_name || "-"}
                      </TableCell>
                      <TableCell>
                        {summary.domain_name || summary.shop_domain || "-"}
                      </TableCell>
                      <TableCell>
                        {summary.sector_name || summary.shop_sector || "-"}
                      </TableCell>
                      <TableCell>
                        {formatActionsDetail(summary.action, summary.summary_type)}
                      </TableCell>
                      <TableCell>{summary.shop_no || "-"}</TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
            </Box>
          )}
        </Box>
      </Box>
    
  );
}
