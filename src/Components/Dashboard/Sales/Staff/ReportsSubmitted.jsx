import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import BoxHeader from "../../DashboardContent/BoxHeader";
import { useSelector } from "react-redux";
import { get_userByToken } from "../../../../API/expressAPI";
import StaffReportSubmitted from "./StaffReportSubmitted";
import { useParams, useSearchParams } from "react-router-dom";
import UpdateStaffReportSubmittedForm from "./UpdateStaffReportSubmittedForm";

function ReportsSubmitted() {
    const token = useSelector((state) => state.auth.token);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const taskId = searchParams.get("id");
    const taskReportingDate = searchParams.get("date");
    const task_token = searchParams.get("token");
    const summary_group_id = searchParams.get("group");

    useEffect(() => {
        if (token) {
            const fetchUser = async () => {
                try {
                    const resp = await get_userByToken(token);
                    console.log(resp);

                    if (resp?.user) {
                        setUser(resp.user);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    return (
        <Box className="body">
            <Box className="content">
                <BoxHeader title={(task_token && summary_group_id) ? 'tasks' : user && `${user?.role_name} - ${user?.name}`} searchField={false} backIcon={(task_token && summary_group_id) ? true : false} handleBackClick={-1}/>
                <Box className="body">
                    {(task_token && summary_group_id) ? <UpdateStaffReportSubmittedForm/> : <StaffReportSubmitted />}
                </Box>
            </Box>
        </Box>
    );
}

export default ReportsSubmitted;