import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import BoxHeader from "../DashboardContent/BoxHeader";
import Tabs from "../DashboardContent/Tabs";
import B2B from "./B2B";

function Finance() {  
  
  const visitorData = [
    {
      id: 1,
      name: "B2B",
      content: <B2B/>,
    },
    {
      id: 2,
      name: "B2C",
      content:<B2B/>,
    },
  ];
  

  return (
    <Box className="body finance">
      <Box className="content">
        <BoxHeader
          title='Finance'
          searchField={false}
        />
        <Box className="body">
            <Tabs data={visitorData} />
        </Box>
      </Box>
     
    </Box>
  );
}

export default Finance