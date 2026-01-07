import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import BoxHeader from "../../DashboardContent/BoxHeader";
import StaffReportForm from "../Manager/StaffReportForm";

function StaffReport() {
    const [open, setOpen] = useState(false);

    return (
        <Box className="body">
            <Box className="content">
                <BoxHeader title="Staff Report"/>
                <Box className="body">
                    <StaffReportForm />
                </Box>
            </Box>
        </Box>
    );
}

export default StaffReport;
