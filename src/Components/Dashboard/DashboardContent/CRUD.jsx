import React from "react";
import { Box } from "@mui/material";
import { crudFieldsData } from "../../../crudFieldData";
import Tabs from "../DashboardContent/Tabs";
import Travel_time_CRUD from "../ITManager/Travel_time_CRUD";

function CRUD() {

  const tabsData = [
    {
      id: 1,
      name: "Airline Arrival",
      content: <Travel_time_CRUD page='airline_arrival' fieldsData={crudFieldsData} />,
    },
    {
      id: 2,
      name: "Airline Departure",
      content: <Travel_time_CRUD page='airline_departure' fieldsData={crudFieldsData} />,
    },
    {
      id: 3,
      name: "Train Arrival",
      content: <Travel_time_CRUD page='train_arrival' fieldsData={crudFieldsData} />,
    },
    {
      id: 4,
      name: "Train Departure",
      content: <Travel_time_CRUD page='train_departure' fieldsData={crudFieldsData} />,
    },
    {
      id: 5,
      name: "Bus Arrival",
      content: <Travel_time_CRUD page='bus_arrival' fieldsData={crudFieldsData} />,
    },
    {
      id: 6,
      name: "Bus Departure",
      content: <Travel_time_CRUD page='bus_departure' fieldsData={crudFieldsData} />,
    },
  ];

  return (
    <Box className="tabs-2">
      <Tabs data={tabsData} verticalTabs={true} />
    </Box>
  );
}

export default CRUD;
