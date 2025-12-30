import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import DialogPopup from "../../DialogPopup";
import BoxHeader from "../../DashboardContent/BoxHeader";
import AddStaffForm from "../SalesManager/AddStaffForm";
import StaffDashboardTable from "./StaffDashboardTable";
import { useSelector } from "react-redux";
import { get_userByToken } from "../../../../API/expressAPI";

function SalesStaffDashboard() {
    const [open, setOpen] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                <BoxHeader title={user ? `${user?.role_name} - ${user?.name}`: ''} searchField={true} />
                <StaffDashboardTable />
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

export default SalesStaffDashboard;