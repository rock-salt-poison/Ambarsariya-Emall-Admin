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
import { get_role_employees, get_staff } from "../../../../API/expressAPI";
import { useSelector } from "react-redux";

export default function DashboardTable() {
  const token = useSelector((state) => state.auth.token);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(token){
      const fetchEmployees = async () => {
        try{
          setLoading(true);
          const resp = await get_staff(token);
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
            {employees.length > 0 ? employees.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.department_name}</TableCell>
                <TableCell sx={{textTransform:'capitalize'}}>{emp.role_name}</TableCell>
                <TableCell>{(emp.start_date)?.split('T')?.[0]}</TableCell>
                <TableCell>{emp.age}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.email}</TableCell>
              </TableRow>
            )) : <TableRow>
                <TableCell colSpan={7} sx={{textAlign:'center'}}>No staff created</TableCell>
            </TableRow> }
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
