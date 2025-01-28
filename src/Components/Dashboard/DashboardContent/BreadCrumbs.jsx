import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

function BreadCrumbs({main_page, redirectTo, subpage}) {
    
  return (
    <Box className="breadcrumb">
        <Link to={redirectTo} className='link'>
            {main_page} 
        </Link>
        <Typography className='page_name'>/ {subpage}</Typography>
    </Box>
  )
}

export default BreadCrumbs