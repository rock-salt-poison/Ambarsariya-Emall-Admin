import { Box } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import BoxHeader from "../DashboardContent/BoxHeader";
import BreadCrumbs from "../DashboardContent/BreadCrumbs";
import Tabs from "../DashboardContent/Tabs";
import Form from "../DashboardContent/Form";
import { fieldsData } from "../../../fieldsData";
import { crudFieldsData } from "../../../crudFieldData";
import { noticeFieldData } from "../../../noticeFieldData";
import CRUD from "../DashboardContent/CRUD";
import Clock_CRUD from "./Clock_CRUD";
import Notice from "./Notice";
import LEDBoard from "./LEDBoard";
import AmbarsariyaMallEventsForm from "./AmbarsariyaMallEventsForm";
import NoticesCard from "./NoticesCard";
import ADVT from "../DashboardContent/ADVT";
import SupportPageHeaderFamousAreas from "./SupportPageHeaderFamousAreas";

function TodoSubpage() {
  const { page } = useParams();
  const formatPageName = (page) => page.replace(/-/g, "_");

  const convert_case_to_capitalize = (title) => {
    if (title) {
      const title_array = title.split("-");
      const resp = title_array.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );
      const heading = resp.join(" ");
      return heading;
    }
  };

  const tabsData = [
    {
      id: 1,
      name: "API",
      content: <Form page={formatPageName(page)} fieldsData={fieldsData} />,
    },
    {
      id: 2,
      name: "CRUD",
      content:
        page === "travel-time" ? (
          <CRUD page={formatPageName(page)} fieldsData={crudFieldsData} />
        ) : (
          ""
        ),
    },
    {
      id: 3,
      name: "ADVT",
      content:<ADVT page={page}/>
    },
  ];

  const clockTabsData = [
    {
      id: 1,
      name: "CRUD",
      content:
        page === "clock" ? (
          <Clock_CRUD page="airline_arrival" />
        ) : (
          ""
        ),
    },
    {
      id: 3,
      name: "ADVT",
      content:<ADVT page={page}/>
    },
  ];


  return (
    <Box className="body">
      <BreadCrumbs main_page="To Do" redirectTo="../todo" subpage={convert_case_to_capitalize(page)}/>
      <Box className="content">
        <BoxHeader title={convert_case_to_capitalize(page)} />
        <Box className="body">
          {page === "travel-time" ? (
            <Tabs data={tabsData} />
          ) : page === "aqi-api" ? (
            <Form page={formatPageName(page)} fieldsData={fieldsData} />
          ) : page === "clock" ? (
            <Tabs data={clockTabsData} />
          ) : page === "notices" ? (
              <NoticesCard/>
          ) : page === "district-administration" ||
            page === "city-events" ||
            page === "thought-of-the-day" ? (
            <Notice
              page={formatPageName(page)}
              title={convert_case_to_capitalize(page)}
              fieldsData={noticeFieldData}
            />
          ) : page === "ambarsariya-mall-events" ? (
            <AmbarsariyaMallEventsForm
              page={formatPageName(page)}
              title={convert_case_to_capitalize(page)}
            />
          ) : 
            page === "LED-board-display" ? (
              <LEDBoard
                page={formatPageName(page)}
                title={convert_case_to_capitalize(page)}
                fieldsData={noticeFieldData}
              />
            ) : (
            page === "support-page-header-famous-areas" && (
              <SupportPageHeaderFamousAreas
                page={formatPageName(page)}
                title={convert_case_to_capitalize(page)}
                fieldsData={fieldsData}
              />
            )
        )}
        </Box>
      </Box>
    </Box>
  );
}

export default TodoSubpage;
