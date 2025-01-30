import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material';
import { get_notice } from '../../../API/expressAPI';
import { Link } from 'react-router-dom';

function NoticesCard() {

    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);

    const data = [
        {id:1, title: 'District Administration', message:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, nisi pariatur. Eligendi corporis ratione molestiae deleniti ducimus officiis, natus, ad quasi illo nostrum odit velit, corrupti totam facere sequi blanditiis earum nemo saepe ipsum odio dicta sed vero vel. Temporibus!', to:'Citizens of Amritsar'},
        {id:2, title: 'District Administration', message:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, nisi pariatur. Eligendi corporis ratione molestiae deleniti ducimus officiis, natus, ad quasi illo nostrum odit velit, corrupti totam facere sequi blanditiis earum nemo saepe ipsum odio dicta sed vero vel. Temporibus!'}
    ]

    

    useEffect(()=>{
        const fetchNotices = async () => {
            try{
                setLoading(true);
                const resp = await get_notice();
                if(resp.message === 'Valid'){
                    setNotices(resp.data);
                }
            }catch(e){
                console.log(e);
            }finally{
                setLoading(false);
            }
        }
        fetchNotices();
    },[]);

  return (
    <Box className="notice">
        {loading && <Box className="loading"><CircularProgress/></Box> }
        
        <Box className="col grid">
            {notices?.map((notice) => {
            return (
                <Link className="card" key={notice.id} to={`${notice.title}/${notice.id}`}>
                <Typography className="title">{notice.title}</Typography>
                <Typography className="desc" dangerouslySetInnerHTML={{
                    __html: `${notice.message || ""}`,
                }}></Typography>
                <Typography className="date">{new Date(notice?.from_date).toLocaleDateString("en-CA")} -{" "}
                {new Date(notice?.to_date).toLocaleDateString("en-CA")}</Typography>
                </Link>
            );
            })}
            
        </Box>
    </Box>
  )
}

export default NoticesCard