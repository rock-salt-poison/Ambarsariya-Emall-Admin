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

export default function StaffDashboardTable() {
  const token = useSelector((state) => state.auth.token);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(token){
      const fetchEmployees = async () => {
        try{
          setLoading(true);
          const resp = await get_staff_tasks(token);
          console.log(resp);
          if(resp){
            setEmployees(resp);
          }
        }catch(e){
          console.log(e);
          setEmployees([])
        }finally{
          setLoading(false);
        }
      }
      fetchEmployees();
    }
  }, [token]);

  
  return (
    <>
    {loading && <Box className="loading"><CircularProgress/></Box> }
      <Box className="col">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Tasks</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? employees.map((emp, index) => (
              <TableRow key={emp.id} hover>
                <TableCell>{index +1}</TableCell>
                <TableCell sx={{textTransform:'capitalize'}}>{emp.assigned_task}</TableCell>
                <TableCell>{(emp.start_date)?.split('T')?.[0]}</TableCell>
                <TableCell>{(emp.end_date)?.split('T')?.[0]}</TableCell>
              </TableRow>
            )) : <TableRow>
                <TableCell colSpan={7} sx={{textAlign:'center'}}>No task created</TableCell>
            </TableRow> }
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
