import React from 'react'
import { Box } from '@mui/material'
import BoxHeader from '../DashboardContent/BoxHeader'
import Card from '../DashboardContent/Card'

function Accounts() {

    const data = [
        {id:1, title:'Visitors', desc:'Sell', to:``},
        {id:2, title:'Members', desc:'Sell', to:``},
        {id:3, title:'Shops', desc:'Sell', to:``},
        {id:4, title:'Merchants', desc:'Sell', to:``},
        {id:5, title:'Traders', desc:'Sell', to:``},
    ]

    return (
        <Box className="body">
            <Box className="content">
                <BoxHeader title="Accounts"/>
                <Card data={data && data}/>
            </Box>
        </Box>
    )
}

export default Accounts