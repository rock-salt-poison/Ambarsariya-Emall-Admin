import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import BoxHeader from "../../DashboardContent/BoxHeader";
import DashboardTable from "./DashboardTable";
import AssignTaskForm from "./AssignTaskForm";

function AssignTask() {

    return (
        <Box className="body">
            <Box className="content">
                <BoxHeader title="Sales Manager" searchField={false}/>
                <Box className="body">
                    <AssignTaskForm />
                </Box>
            </Box>
        </Box>
    );
}

export default AssignTask;
