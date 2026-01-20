import React from 'react'
import { Box, Typography } from '@mui/material'
import FormFields from '../../Form/FormFields'
import { Link, useNavigate } from 'react-router-dom'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

function BoxHeader({title, searchField=false, onSearch, icon1, icon2, handleIconClick1, handleIconClick2, backIcon, handleBackClick}) {
  const navigate = useNavigate();
  
  const handleBack = (e) => {
    e.preventDefault();
    if (typeof handleBackClick === 'function') {
      handleBackClick();
    } else if (typeof handleBackClick === 'string') {
      navigate(handleBackClick);
    } else if (typeof handleBackClick === 'number') {
      navigate(handleBackClick);
    }
  };

  return (
    <Box className="header">
      <Box>{backIcon ? (
        typeof handleBackClick === 'function' || typeof handleBackClick === 'number' ? (
          <Link to="#" onClick={handleBack} style={{ textDecoration: 'none', color: 'inherit' }}>
            <KeyboardArrowLeftIcon sx={{verticalAlign:'middle', marginRight:'8px', fontSize:'20px'}}/>
          </Link>
        ) : (
          <Link to={handleBackClick}>
            <KeyboardArrowLeftIcon sx={{verticalAlign:'middle', marginRight:'8px', fontSize:'20px'}}/>
          </Link>
        )
      ) : ''}
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