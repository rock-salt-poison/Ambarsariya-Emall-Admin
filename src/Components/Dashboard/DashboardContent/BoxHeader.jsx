import React from 'react'
import { Box, Typography } from '@mui/material'
import FormFields from '../../Form/FormFields'
import { Link } from 'react-router-dom'

function BoxHeader({title, searchField=false, onSearch, icon1, icon2, handleIconClick1, handleIconClick2}) {
  return (
    <Box className="header">
        <Typography className="heading-2">{title}</Typography>
        {searchField && <FormFields
            label="Search"
            name="Search"
            type="search"
            width={false}
            onChange={onSearch}
        />}
        {icon1 &&  <Box className="icons">
          {icon1 && <Link onClick={handleIconClick1}>{icon1}</Link>}
        </Box>}
       
        
    </Box>
  )
}

export default BoxHeader