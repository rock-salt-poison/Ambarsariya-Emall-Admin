import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import BoxHeader from '../DashboardContent/BoxHeader'

function ToDo() {

    const data = [
        {id:1, title:'Travel Time', desc:'Home Page', to:`/todo/travel-time`},
        {id:2, title:'AQI API', desc:'Home Page', to:`/todo/aqi-api`},
        {id:3, title:'Clock Page', desc:'Home Page', to:`/todo/clock-page`},
        {id:4, title:'City Events Notice', desc:'Home Page', to:`/todo/city-events`},
        {id:5, title:'District Administration Notice', desc:'Home Page', to:`/todo/district-administration`},
        {id:6, title:'Ambarsariya Mall Events Notice', desc:'Home Page', to:`/todo/ambarsariya-mall-events`},
        {id:7, title:'Thought of the day Notice', desc:'Home Page', to:`/todo/thought-of-the-day`},
        {id:8, title:'LED Board Display', desc:'Home Page', to:`/todo/LED-board-display`},
        {id:9, title:'Radio', desc:'Home Page', to:`/todo/radio`},
        {id:10, title:'Header Famous Areas', desc:'Support Page', to:`/todo/support-page-header-famous-areas`},
        {id:11, title:'Payment Gateway', desc:'Ambarsariya Mall', to:`/todo/account-details`},
    ]

    return (
        <Box className="body">
            <Box className="content">
                <BoxHeader title="To Do"/>
                <Box className="col grid">
                    {
                        data.map((card)=> {
                            return <Link className="card" key={card.id} to={card.to}>
                            <Typography className='title'>{card.title}</Typography>
                            <Typography className='desc'>{card.desc}</Typography>
                        </Link>
                        })
                    }
                    
                </Box>
            </Box>
        </Box>
    )
}

export default ToDo