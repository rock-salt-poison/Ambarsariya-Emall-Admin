import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import BoxHeader from "../DashboardContent/BoxHeader";
import Tabs from "../DashboardContent/Tabs";
import ReceivableTable from "./ReceivableTable";
import { useParams } from "react-router-dom";

function B2B() {  

  const { type } = useParams();
  
  const visitorData = [
    {
      id: 1,
      name: "Receivable",
      content: <ReceivableTable/>,
    },
    {
      id: 2,
      name: "Payable",
      content:<ReceivableTable/>,
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

export default B2B