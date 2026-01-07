import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DialogPopup from "../../DialogPopup";
import BoxHeader from "../../DashboardContent/BoxHeader";
import DashboardTable from "../../../Dashboard/Sales/Manager/DashboardTable";
import AddStaffForm from "./AddStaffForm";

function SalesDashboard() {
    const [open, setOpen] = useState(false);

    return (
        <Box className="body">
            <Box className="cta-button">
                <Button
                    onClick={() => {
                        setOpen(true);
                    }}
                    className="btn_submit"
                >
                
                    Add Staff Member
                </Button>
            </Box>
            <Box className="content">
                <BoxHeader title="Sales Executives" searchField={true}/>
                <DashboardTable />
            </Box>

            <DialogPopup
                open={open}
                handleClose={() => setOpen(false)}
                FormComponent= {AddStaffForm}
                popupHeading="Add Staff Member"
            />
        </Box>
    );
}

export default SalesDashboard;
