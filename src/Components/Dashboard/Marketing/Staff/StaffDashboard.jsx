import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import BoxHeader from "../../DashboardContent/BoxHeader";
import StaffDashboardTable from "./StaffDashboardTable";
import { useSelector } from "react-redux";
import { get_userByToken } from "../../../../API/expressAPI";

function MarketingStaffDashboard() {
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
                <BoxHeader title={user ? `Marketing ${user?.role_name} - ${user?.name}`: ''} searchField={false} />
                <StaffDashboardTable />
            </Box>
        </Box>
    );
}

export default MarketingStaffDashboard;