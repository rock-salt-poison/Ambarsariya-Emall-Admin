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

export default function MarketingStaffReportTable({ data, allReports }) {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (allReports && Array.isArray(allReports) && allReports.length > 0) {
      // Use allReports when available (all reports view)
      setReport(allReports);
    } else if (data) {
      // Handle data prop - can be array or single object
      if (Array.isArray(data)) {
        setReport(data);
      } else if (data.task_report_id) {
        // Single report object
        setReport([data]);
      } else {
        setReport([]);
      }
    } else {
      setReport([]);
    }
  }, [data, allReports]);

  const handleRowClick = (taskReportId) => {
    navigate(`/marketing/staff-report-details/${taskReportId}`);
  };

  const formatAction = (action, summaryType, status) => {
    if (!action || typeof action !== 'object') {
      return "-";
    }
    
    // Extract the appropriate action array based on summary type
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
    
    // Define priority orders for each summary type
    const getPriority = (actionValue, summaryType) => {
      if (summaryType === "Client Summary") {
        const priorities = {
          "completed": 1,
          "incomplete": 2,
          "recollect": 3,
          "discard": 4
        };
        return priorities[actionValue?.toLowerCase()] || 999;
      } else if (summaryType === "Capture Summary") {
        const priorities = {
          "captured": 1,
          "revisit": 2,
          "feedback": 3,
          "visit": 4,
          "send url": 5,
          "form 1": 6
        };
        return priorities[actionValue?.toLowerCase()] || 999;
      } else if (summaryType === "Confirm Summary") {
        const priorities = {
          "self creation": 1,
          "staff visit": 2,
          "support": 3,
          "hold": 4,
          "pending": 5
        };
        return priorities[actionValue?.toLowerCase()] || 999;
      }
      return 999;
    };
    
    // Get status priority for Capture Summary (confirm > reaction > pending)
    const getStatusPriority = (statusValue) => {
      const statusPriorities = {
        "confirm": 1,
        "re-action": 2,
        "reaction": 2,
        "pending": 3
      };
      return statusPriorities[statusValue?.toLowerCase()] || 999;
    };
    
    // Filter out items with null or empty actions, then find the one with highest priority
    const validActions = actionArray.filter(item => item?.action);
    
    if (validActions.length === 0) {
      return "-";
    }
    
    // For Capture Summary, prioritize based on status first, then action
    if (summaryType === "Capture Summary" && status) {
      const statusPriority = getStatusPriority(status);
      
      // For Capture Summary, status priority influences which action to show
      // Status priority: confirm (1) > reaction (2) > pending (3)
      // Lower status priority number = higher priority
      // We'll use status priority as a modifier: lower status priority boosts action priority
      let finalAction = validActions[0];
      let bestScore = Infinity;
      
      validActions.forEach((item) => {
        const actionPriority = getPriority(item?.action, summaryType);
        // Combine action priority with status priority
        // Lower numbers = higher priority
        // Formula: (actionPriority * 100) + statusPriority
        // This ensures status priority (confirm=1) gets highest priority
        const score = (actionPriority * 100) + statusPriority;
        
        if (score < bestScore) {
          bestScore = score;
          finalAction = item;
        }
      });
      
      if (!finalAction || !finalAction.action) {
        return "-";
      }
      
      return (
        <div>
          <strong>{finalAction.action}</strong>
          {/* {finalAction.comment && (
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '2px' }}>
              {finalAction.comment}
            </div>
          )} */}
        </div>
      );
    }
    
    // For other summary types, use action priority only
    // Find the action with the highest priority (lowest priority number)
    let finalAction = validActions[0];
    let highestPriority = getPriority(finalAction?.action, summaryType);
    
    validActions.forEach((item) => {
      const priority = getPriority(item?.action, summaryType);
      if (priority < highestPriority) {
        highestPriority = priority;
        finalAction = item;
      }
    });
    
    // Display only the final action
    if (!finalAction || !finalAction.action) {
      return "-";
    }
    
    return (
      <div>
        <strong>{finalAction.action}</strong>
        {/* {finalAction.comment && (
          <div style={{ fontSize: '0.85em', color: '#666', marginTop: '2px' }}>
            {finalAction.comment}
          </div>
        )} */}
      </div>
    );
  };

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
              <TableCell>Assigned Task</TableCell>
              <TableCell>Assigned By</TableCell>
              <TableCell>Reporting Date</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {report.length > 0 ? (
              report.map((r, index) => (
                <TableRow 
                  key={r.task_report_id || index} 
                  hover 
                  onClick={() => {
                    const taskReportId = r.task_report_id;
                    if (taskReportId) {
                      handleRowClick(taskReportId);
                    }
                  }}
                  sx={{ cursor: r.task_report_id ? 'pointer' : 'default' }}
                >
                  <TableCell>{index + 1}</TableCell>
                    <TableCell>{r.assigned_task || "-"}</TableCell>
                    <TableCell>{r.assigned_by || "-"}</TableCell>
                  <TableCell>
                    {r.task_reporting_date 
                      ? dayjs(r.task_reporting_date).format('YYYY-MM-DD') 
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {r.start_date 
                      ? dayjs(r.start_date).format('YYYY-MM-DD') 
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {r.end_date 
                      ? dayjs(r.end_date).format('YYYY-MM-DD') 
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center" }}>
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
