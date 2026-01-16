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
} from "@mui/material";
import { get_staff_tasks } from "../../../../API/expressAPI";
import { useSelector } from "react-redux";
import DialogPopup from "../../DialogPopup";
import AssignedTaskForm from "./AssignedTaskForm";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function StaffDashboardTable() {
  const token = useSelector((state) => state.auth.token);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // track clicked task
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const fetchEmployees = async () => {
        try {
          setLoading(true);
          const resp = await get_staff_tasks(token);
          console.log(resp);
          if (resp) setEmployees(resp);
        } catch (e) {
          console.log(e);
          setEmployees([]);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployees();
    }
  }, [token]);

  const handleRowClick = (task) => {
    navigate(task?.access_token)
    // setSelectedTask(task); // store the clicked task
    // setOpen(true);         // open the popup
  };

  return (
    <>
      {loading && <Box className="loading"><CircularProgress /></Box>}
      <Box className="container">
        <Box className="col">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Tasks</TableCell>
              <TableCell>Assigned By</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? employees.map((emp, index) => (
              <TableRow
                key={emp.id}
                hover
                onClick={() => handleRowClick(emp)} // add click handler
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>{emp.assigned_task}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>{emp.assigned_by_name}</TableCell>
                <TableCell>{dayjs(emp?.start_date)?.format('YYYY-MM-DD')}</TableCell>
                <TableCell>{dayjs(emp?.end_date)?.format('YYYY-MM-DD')}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center" }}>No task created</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </Box>
      </Box>

      <DialogPopup
        open={open}
        handleClose={() => setOpen(false)}
        FormComponent={AssignedTaskForm} // you may replace this with a TaskDetails component
        popupHeading="Task Details"
        task={selectedTask} // pass the clicked task
      />
    </>
  );
}