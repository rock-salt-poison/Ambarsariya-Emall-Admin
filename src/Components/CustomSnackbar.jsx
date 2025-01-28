import React from "react";
import Snackbar from "@mui/material/Snackbar";

export default function CustomSnackbar({
  message,
  open,
  handleClose,
}) {
  return (
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={message}
      >
      </Snackbar>
  );
}
