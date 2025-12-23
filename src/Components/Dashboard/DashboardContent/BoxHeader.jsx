import React from 'react'
import { Box, Typography } from '@mui/material'
import FormFields from '../../Form/FormFields'
import { Link } from 'react-router-dom'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

function BoxHeader({title, searchField=false, onSearch, icon1, icon2, handleIconClick1, handleIconClick2, backIcon, handleBackClick}) {
  return (
    <Box className="header">
      <Box>{backIcon ? <Link to={handleBackClick}><KeyboardArrowLeftIcon sx={{verticalAlign:'middle', marginRight:'8px', fontSize:'20px'}}/></Link> : ''}
        <Typography className="heading-2" variant='span' sx={{verticalAlign:'middle'}}>{title}</Typography></Box>
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