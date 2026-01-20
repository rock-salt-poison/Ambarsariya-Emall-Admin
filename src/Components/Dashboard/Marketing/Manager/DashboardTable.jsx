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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=>{
    if(token){
      const fetchEmployees = async () => {
        try{
          setLoading(true);
          const resp = await get_staff(token);
          // console.log(resp);
          if(resp && Array.isArray(resp)){
            setEmployees(resp);
            // Get is_admin from first item (all items will have same value)
            setIsAdmin(resp.length > 0 ? (resp[0]?.is_admin || false) : false);
          } else {
            setEmployees([]);
            setIsAdmin(false);
          }
        }catch(e){
          console.log(e);
          setEmployees([]);
          setIsAdmin(false);
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
        <Box className="container">
      <Box className="col">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              {isAdmin && <TableCell>Manager</TableCell>}
              <TableCell>Area Assigned</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Phone No.</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? employees.map((emp, index) => (
              <TableRow key={index} hover>
                <TableCell>{emp.name}</TableCell>
                <TableCell sx={{textTransform:'capitalize'}}>{emp.staff_type_name}</TableCell>
                {isAdmin && <TableCell>{emp.manager_name || 'N/A'}</TableCell>}
                <TableCell>{emp.assign_area_name}</TableCell>
                <TableCell>{(emp.start_date)?.split('T')?.[0]}</TableCell>
                <TableCell>{emp.age}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.email}</TableCell>
              </TableRow>
            )) : <TableRow>
                <TableCell colSpan={isAdmin ? 8 : 7} sx={{textAlign:'center'}}>No staff created</TableCell>
            </TableRow> }
          </TableBody>
        </Table>
      </Box>
      </Box>
    </>
  );
}
