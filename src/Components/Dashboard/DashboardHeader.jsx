import { Box, Typography } from '@mui/material'
import React from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';

function DashboardHeader({user}) {
  return (
    <Box className="header">
        <Typography className='heading dark'>{user} Dashboard</Typography>
        <NotificationsIcon/>
    </Box>
  )
}

export default DashboardHeader