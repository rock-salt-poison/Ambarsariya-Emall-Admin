import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DialogPopup from "../../DialogPopup";
import BoxHeader from "../../DashboardContent/BoxHeader";
import DashboardTable from "../SalesManager/DashboardTable";
import AddStaffForm from "../SalesManager/AddStaffForm";

function SalesStaffDashboard() {
    const [open, setOpen] = useState(false);

    return (
        <Box className="body">
            <Box className="content">
                <BoxHeader title="Sales Staff" searchField={true}/>
                <DashboardTable />
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
