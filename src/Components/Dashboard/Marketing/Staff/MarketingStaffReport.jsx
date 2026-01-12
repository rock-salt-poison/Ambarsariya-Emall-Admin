import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import DialogPopup from "../../DialogPopup";
import BoxHeader from "../../DashboardContent/BoxHeader";
import AddStaffForm from "../Manager/AddStaffForm";
import StaffDashboardTable from "./StaffDashboardTable";
import StaffReportForm from "./StaffReportForm";
import MarketingStaffReportForm from "../Manager/MarketingStaffReportForm";

function MarketingStaffReport() {
    const [open, setOpen] = useState(false);

    return (
        <Box className="body">
            <Box className="content">
                <BoxHeader title="Staff Report"/>
                <Box className="body">
                    <MarketingStaffReportForm />
                </Box>
            </Box>

            <DialogPopup
                open={open}
                handleClose={() => setOpen(false)}
                FormComponent= {AddStaffForm}
                popupHeading="Tasks"
            />
        </Box>
    );
}

export default MarketingStaffReport;
