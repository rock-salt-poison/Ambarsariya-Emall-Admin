import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import DialogPopup from "../../DialogPopup";
import BoxHeader from "../../DashboardContent/BoxHeader";
import AddStaffForm from "../SalesManager/AddStaffForm";
import StaffDashboardTable from "./StaffDashboardTable";

function SalesStaffDashboard() {
    const [open, setOpen] = useState(false);

    return (
        <Box className="body">
            <Box className="content">
                <BoxHeader title="Sales Staff" searchField={true}/>
                <StaffDashboardTable />
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

export default SalesStaffDashboard;
