import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import DialogPopup from "../../DialogPopup";
import BoxHeader from "../../DashboardContent/BoxHeader";
import StaffDashboardTable from "./StaffDashboardTable";
import StaffReportForm from "./StaffReportForm";
import { useParams } from "react-router-dom";
import AddStaffForm from "../Manager/AddStaffForm";

function MarketingStaffDailyTaskReport() {
  const [open, setOpen] = useState(false);
  const { token } = useParams();
  console.log(token);

  return (
    <Box className="body">
      <Box className="content">
        <BoxHeader
          title="Daily Task Report"
          backIcon={true}
          handleBackClick={"../marketing-staff/my-tasks"}
        />
        <Box className="body">
          <StaffReportForm />
        </Box>
      </Box>

      <DialogPopup
        open={open}
        handleClose={() => setOpen(false)}
        FormComponent={AddStaffForm}
        popupHeading="Tasks"
      />
    </Box>
  );
}

export default MarketingStaffDailyTaskReport;
