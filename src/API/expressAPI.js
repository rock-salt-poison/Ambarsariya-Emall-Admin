import axios from 'axios';

const link = `${process.env.REACT_APP_EXPRESS_API_LINK}/api/ambarsariya/admin`;

export const post_travel_time = async (data) => {
    try{
        const response = await axios.post(`${link}/travel-time`, data);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_travel_time = async (data) => {
    try{
        const response = await axios.get(`${link}/travel-time/${data.mode}/${data.travel_type}`);
        return response.data;
    }catch(e){
        throw e;
    }
}