import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Box, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

export default function DialogPopup({open, handleClose, FormComponent, popupHeading, task}) {
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        className='create'
      >
        <DialogContent>
            <Box className="header">
                <Typography className="heading-2" variant="h2">
                    {popupHeading}
                </Typography>
                <CloseIcon onClick={handleClose} sx={{cursor:'pointer'}}/>
            </Box>
            <Box className="body">
               {FormComponent && <FormComponent onClose={handleClose} selectedTask={task}/>}
            </Box>
        </DialogContent>
      </Dialog>
  );
}
