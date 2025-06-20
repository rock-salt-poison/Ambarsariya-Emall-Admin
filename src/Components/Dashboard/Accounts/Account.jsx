import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import BoxHeader from "../DashboardContent/BoxHeader";
import { useParams } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";
import { get_allUsers } from "../../../API/expressAPI";
import AccountsTable from "./AccountsTable";
import { useDebounce } from "@uidotdev/usehooks"; // Importing useDebounce from the library

function Account() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { user_type } = useParams();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // The search query input by the user
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Debounced search query using useDebounce
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce with a 500ms delay

  useEffect(() => {
    const fetchDetails = async () => {
      if (user_type) {
        try {
          setLoading(true);
          const resp = await get_allUsers(user_type);
          console.log(resp);
          
          if (resp.length > 0) {
            setData(resp);
            setFilteredData(resp); // Initially show all data
          }
          setLoading(false);
        } catch (e) {
          setLoading(false);
          console.log(e);
          setSnackbar({ open: true, message: "Error fetching records" });
        }
      }
    };
    fetchDetails();
  }, [user_type]);

  useEffect(() => {
    // Filter data based on the debounced search query
    if (debouncedSearchQuery) {
      const filtered = data.filter((item) =>
        item.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.full_name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.business_name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset the filtered data if the search is empty
    }
  }, [debouncedSearchQuery, data]);

  return (
    <Box className="body">
      {loading && <Box className="loading">
          <CircularProgress/>
        </Box>}
      <Box className="content">
        <BoxHeader
          title={user_type}
          searchField={true}
          onSearch={(e) => setSearchQuery(e.target.value)}  // Update the search query
        />
        <AccountsTable data={filteredData} />
      </Box>
      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}

export default Account;
