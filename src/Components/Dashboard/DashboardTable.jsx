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
import { doesSectionFormatHaveLeadingZeros } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";

export default function DashboardTable() {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

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

  
  return (
    <>
    {loading && <Box className="loading"><CircularProgress/></Box> }
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
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.department_name}</TableCell>
                <TableCell sx={{textTransform:'capitalize'}}>{emp.role_name}</TableCell>
                <TableCell>{(emp.start_date)?.split('T')?.[0]}</TableCell>
                <TableCell>{emp.age}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
