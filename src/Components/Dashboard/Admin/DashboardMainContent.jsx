import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import DashboardTable from "../DashboardTable";
import DialogPopup from "../DialogPopup";
import BoxHeader from "../DashboardContent/BoxHeader";
import CreateRoleForm from "./CreateRoleForm";

function DashboardMainContent() {
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
                
                    Create Role
                </Button>
            </Box>
            <Box className="content">
                <BoxHeader title="Employees" searchField={true}/>
                <DashboardTable />
            </Box>

            <DialogPopup
                open={open}
                handleClose={() => setOpen(false)}
                FormComponent={CreateRoleForm}
                popupHeading="Create Role"
            />
        </Box>
    );
}

export default DashboardMainContent;
