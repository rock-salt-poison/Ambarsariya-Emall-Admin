import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function DashboardTable() {
  function createData(
    id,
    name,
    department,
    start_date,
    age,
    phone_no,
    email
  ) {
    return {
      id,
      name,
      department,
      start_date,
      age,
      phone_no,
      email
    };
  }

  const rows = [
    createData(
      1,
      "Michael Silva",
      "Sales Manager",
      "2011-04-25",
      28,
      9876547890,
      "michael@gmail.com"
    ),
    createData(
      2,
      "Gloria Little",
      "IT Manager",
      "2011-04-29",
      29,
      7894561302,
      "gloria@gmail.com"
    ),
    createData(
      3,
      "Jennifer",
      "Marketing Manager",
      "2021-06-30",
      30,
      7845962987,
      "jennifer@gmail.com"
    ),
  ];

  return (
    <>
      <Box className="col">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Phone No.</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.start_date}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.phone_no}</TableCell>
                <TableCell>{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
