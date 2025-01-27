import axios from 'axios';

const admin_link = `${process.env.REACT_APP_EXPRESS_API_LINK}/admin/api`;
const link = `${process.env.REACT_APP_EXPRESS_API_LINK}/api/ambarsariya`;


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

export const get_led_board_message = async () => {
    try{
        const response = await axios.get(`${admin_link}/led-board-messages`);
        return response.data;
    }catch(e){
        throw e;
    }
} 

export const post_led_board_message = async (data) => {
    try{
        if(data){
            const response = await  axios.post(`${admin_link}/led-board-messages`, data);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const allShops = async () => {
    try{
      const response = await axios.get(`${link}/sell/shops`);
      return response.data;
    }catch(error){
      throw error;
    }
  }

export const delete_led_board_message = async (id) => {
    try{
        if(id){
            const response = await  axios.delete(`${admin_link}/led-board-message/${id}`);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 