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
import { get_role_employees } from "../../API/expressAPI";
import DeleteIcon from '@mui/icons-material/Delete';
import DialogPopup from "./DialogPopup";
import AssignStaffAnEmployeeForm from "./Admin/AssignStaffAnEmployeeForm";

export default function DashboardTable() {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(()=>{
    const fetchEmployees = async () => {
      try{
        setLoading(true);
        const resp = await get_role_employees();
        console.log(resp);
        if(resp){
          setEmployees(resp);
        }
      }catch(e){
        console.log(e);
      }finally{
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const handleDeleteClick = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setOpen(true);
  };


  
  return (
    <>
    {loading && <Box className="loading"><CircularProgress/></Box> }
      <Box className="container">
        <Box className="col">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Phone No.</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? employees.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.department_name}</TableCell>
                <TableCell sx={{textTransform:'capitalize'}}>{emp.role_name}</TableCell>
                <TableCell>{(emp.start_date)?.split('T')?.[0]}</TableCell>
                <TableCell>{emp.age}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell><DeleteIcon className="deleteIcon" onClick={() => handleDeleteClick(emp.id)}
/></TableCell>
              </TableRow>
            )) : <TableRow>
                <TableCell colSpan={7} sx={{textAlign:'center'}}>No employee created</TableCell>
            </TableRow> }
          </TableBody>
        </Table>
        </Box>
      </Box>
      <DialogPopup
          open={open}
          handleClose={() => setOpen(false)}
          FormComponent= {AssignStaffAnEmployeeForm}
          popupHeading="Assign Employee"
          task={selectedEmployeeId}
       />
    </>
  );
}