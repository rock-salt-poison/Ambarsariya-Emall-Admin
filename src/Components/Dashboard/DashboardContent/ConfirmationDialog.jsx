import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

function ConfirmationDialog({ open, onClose, onConfirm, title, message }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm")); // Fullscreen on small screens

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog"
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm" // Set max width to "sm" (small) for better responsiveness
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
