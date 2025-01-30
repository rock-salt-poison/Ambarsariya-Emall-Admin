import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BoxHeader from "../DashboardContent/BoxHeader";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumbs from "../DashboardContent/BreadCrumbs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { delete_notice, get_notice } from "../../../API/expressAPI";
import ConfirmationDialog from "../DashboardContent/ConfirmationDialog";
import CustomSnackbar from "../../CustomSnackbar";

function NoticeDetail() {
  const { title, id } = useParams();

  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

  useEffect(() => {
    const fetchSelectedRecord = async () => {
      if (id && title) {
        try {
          setLoading(true);
          const resp = await get_notice(title, id);
          if (resp.message === "Valid") {
            setSelected(resp.data?.[0]);
          }
        } catch (e) {
          console.error("Error fetching notice:", e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSelectedRecord();
  }, [id, title]);

  const handleDeleteClick = () => {
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if(id && title){
        try{
            const resp = await delete_notice(id, title);
            setSnackbar({ open: true, message: resp.message });
            setTimeout(()=>{
                navigate('../todo/notices')
            }, 2500)
        }catch(e){
            setSnackbar({ open: true, message: 'Failed to delete notice' });
        }
    }
    setDialogOpen(false);
  };

  return (
    <Box className="body">
      {loading && (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}
      <BreadCrumbs
        main_page="Notice"
        redirectTo="../todo/notices"
        subpage={title}
      />

      <Box className="content">
        <BoxHeader
          title={title}
          icon1={<DeleteIcon />}
          handleIconClick1={handleDeleteClick}
        />

        <Box className="body notice">
          <Box className="row">
            {selected?.notice_to && (
              <Box className="col-auto">
                <Typography className="heading">To</Typography>
                <Typography className="message">
                  {selected.notice_to}
                </Typography>
              </Box>
            )}
            {selected?.location && (
              <Box className="col-auto">
                <Typography className="heading">Location</Typography>
                <Typography className="message">{selected.location}</Typography>
              </Box>
            )}
            {selected?.time && (
              <Box className="col-auto">
                <Typography className="heading">Time</Typography>
                <Typography className="message">{selected.time}</Typography>
              </Box>
            )}
            {selected?.entry_fee !== null &&
              selected?.entry_fee !== undefined && (
                <Box className="col-auto">
                  <Typography className="heading">Entry Fee</Typography>
                  <Typography className="message">
                    {selected.entry_fee}
                  </Typography>
                </Box>
              )}

            {selected?.shop_name && (
              <Box className="col-auto">
                <Typography className="heading">Shop</Typography>
                <Typography className="message">
                  {selected.shop_name}
                </Typography>
              </Box>
            )}
            {selected?.community_name && (
              <Box className="col-auto">
                <Typography className="heading">Community</Typography>
                <Typography className="message">
                  {selected.community_name}
                </Typography>
              </Box>
            )}

            {selected?.member_name && (
              <Box className="col-auto">
                <Typography className="heading">Member Name</Typography>
                <Typography className="message">
                  {selected.member_name}
                </Typography>
              </Box>
            )}
            {selected?.community && (
              <Box className="col-auto">
                <Typography className="heading">Community</Typography>
                <Typography className="message">
                  {selected.community}
                </Typography>
              </Box>
            )}
            <Box className="col-auto">
              <Typography className="heading">Date</Typography>
              <Typography className="message">
                {new Date(selected?.from_date).toLocaleDateString("en-CA")} -{" "}
                {new Date(selected?.to_date).toLocaleDateString("en-CA")}
              </Typography>
            </Box>
          </Box>
          <Box className="notice">
            <Box className="col-auto">
              <Typography className="heading">Message</Typography>
              <Box
                className="message"
                dangerouslySetInnerHTML={{
                  __html: `${selected?.message || ""}`,
                }}
              ></Box>
            </Box>
          </Box>
          {selected?.notice_from && (
            <Box className="col-auto">
              <Typography className="heading">From</Typography>
              <Typography className="message">
                {selected.notice_from}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Notice"
        message="Are you sure you want to delete this notice?"
      />
      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
    />
    </Box>
  );
}

export default NoticeDetail;
