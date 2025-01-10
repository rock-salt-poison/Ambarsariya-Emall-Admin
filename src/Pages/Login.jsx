import { Box, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../Components/Login/LoginForm'

function Login() {
    return (
        <Box className="login_wrapper">
            <Box className="row">
                <Box className="col bg_img"></Box>
                <Box className="col">
                    <Box className="container">
                    <Box className="header">
                        <Typography className="heading light">
                            Welcome to Ambarsariya Mall
                        </Typography>
                        <Typography className="description">
                            Please enter your details
                        </Typography>
                    </Box>
                    <Box className="body">
                        <LoginForm/>
                        <Link className='link'>
                            Forgot Password ?
                        </Link>
                    </Box>
                    </Box>
                    
                </Box>
            </Box>
        </Box>
    )
}

export default Login