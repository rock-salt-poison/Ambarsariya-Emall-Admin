import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import BoxHeader from "../DashboardContent/BoxHeader";
import Tabs from "../DashboardContent/Tabs";
import ReceivableTable from "./ReceivableTable";

function B2B() {  
  
  const visitorData = [
    {
      id: 1,
      name: "Receivable",
      content: <ReceivableTable/>,
    },
    {
      id: 2,
      name: "Payable",
      content:'',
    },
  ];
  

  return (
      <Box className="content">
            <Tabs data={visitorData} />
      </Box>
     
  );
}

export default B2B