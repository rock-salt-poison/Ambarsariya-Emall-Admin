import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link, useParams } from 'react-router-dom'

function BreadCrumbs({main_page, redirectTo}) {

    const {page} = useParams();

    const title = page.replace(/-/g, ' ');

  return (
    <Box className="breadcrumb">
        <Link to={redirectTo} className='link'>
            {main_page} 
        </Link>
        <Typography className='page_name'>/ {title}</Typography>
    </Box>
  )
}

export default BreadCrumbs