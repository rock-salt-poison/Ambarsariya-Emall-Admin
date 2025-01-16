import axios from 'axios';

const admin_link = `${process.env.REACT_APP_EXPRESS_API_LINK}/admin/api`;

export const post_travel_time = async (data) => {
    try{
        const response = await axios.post(`${admin_link}/travel-time`, data);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_travel_time = async (data) => {
    try{
        const response = await axios.get(`${admin_link}/travel-time/${data.mode}/${data.travel_type}`);
        return response.data;
    }catch(e){
        throw e;
    }
}


export const post_countries = async (data) => {
    try{
        const response = await axios.post(`${admin_link}/countries`, data);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_countries = async () => {
    try{
        const response = await axios.get(`${admin_link}/countries`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const post_notice = async (data) => {
    try{
        const response = await axios.post(`${admin_link}/notice`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });        
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_notice = async (title) => {
    try{
        if(title){
            const response = await  axios.get(`${admin_link}/notice/${title}`);
            return response.data;
        }else{
            const response = await  axios.get(`${admin_link}/notices`);
            return response.data;
        }
    }catch(e){
        throw e;
    }
}