import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Box, Button, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import FormFields from '../Form/FormFields';

export default function DialogPopup({open, handleClose, fields, formData, handleOnChange, handleSubmit, errors}) {
  
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
                    Create Role
                </Typography>
                <CloseIcon onClick={handleClose} sx={{cursor:'pointer'}}/>
            </Box>
            <Box className="body">
                <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                  {fields.map((field)=> {
                      return <FormFields
                        key={field.id}
                        label={field.label}
                        name={field.name}
                        value={field.value? field.value : formData[field.name]}
                        type={field.type}
                        options={field.options}
                        error={!!errors[field.name]}
                        onChange={(e)=>handleOnChange(e)}
                        helperText={errors[field.name]} 
                      />
                  })}

                <Button type="submit" variant="contained" className='btn_submit'>
                  Create
                </Button>
                </Box>
            </Box>
        </DialogContent>
      </Dialog>
  );
}
