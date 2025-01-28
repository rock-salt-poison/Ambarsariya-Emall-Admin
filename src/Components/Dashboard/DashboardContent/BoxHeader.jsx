import React from 'react'
import { Box, Typography } from '@mui/material'
import FormFields from '../../Form/FormFields'

function BoxHeader({title, searchField=false, onSearch}) {
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
        
    </Box>
  )
}

export default BoxHeader