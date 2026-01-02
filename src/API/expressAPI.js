import axios from 'axios';

const admin_link = `${process.env.REACT_APP_EXPRESS_API_LINK}/admin/api`;
const link = `${process.env.REACT_APP_EXPRESS_API_LINK}/api/ambarsariya`;
const admin_roles_api = `${process.env.REACT_APP_EXPRESS_API_LINK}/admin/roles`;

export const authenticateUser = async (data) => {
  try {
    const response = await axios.post(`${admin_link}/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const get_userByToken = async (token) => {
    try{
        const response = await axios.get(`${admin_link}/employee/${token}`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_staff_tasks = async (token) => {
    try{
        const response = await axios.get(`${admin_roles_api}/staff-tasks/${token}`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_staff_tasks_by_reporting_date = async (token, task_reporting_date) => {
    try{
        const response = await axios.get(`${admin_roles_api}/staff-tasks-by-date/${token}/${task_reporting_date}`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_staff_members_by_manager_id = async (id) => {
    try{
        const response = await axios.get(`${admin_roles_api}/staff-members/${id}`);
        return response.data;
    }catch(e){
        throw e;
    }
}

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

export const get_notice = async (title, id) => {
    try{
        if(title){
            const response = await  axios.get(`${admin_link}/notice/${title}/${id}`);
            return response.data;
        }else{
            const response = await  axios.get(`${admin_link}/notices`);
            return response.data;
        }
    }catch(e){
        throw e;
    }
}

export const delete_notice = async (id, title) => {
    try{
        if(id && title){
            const response = await  axios.delete(`${admin_link}/notice/${title}/${id}`);
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

export const get_allUsers = async (user_type) => {
    try{
        if(user_type){
            const resp = await axios.get(`${admin_link}/users/${user_type}`);
            return resp.data;
        }
    }catch(e){
        throw e;
    }
}

export const get_visitorData = async (access_token, sender_id) => {
    if(sender_id){
        try{
            const response = await axios.get(`${link}/sell/support/${access_token}/${sender_id}`);
            return response.data;
        }catch(e){
            throw e;
        }
    }else{
        try{
            const response = await axios.get(`${link}/sell/support/${access_token}`);
            return response.data;
        }catch(e){
            throw e;
        }
    }
}

export const getShopUserData = async (shopAccessToken) => {
    try{
      const response = await axios.get(`${link}/sell/shop-user-data?shop_access_token=${shopAccessToken}`);
      return response.data;
    }catch(error){
      throw error;
    }
}

export const get_discount_coupons = async (shop_no) => {
    try{
      const response = await axios.get(`${link}/sell/discount-coupons/${shop_no}`);
      return response.data;
    }catch(e){
      throw e;
    }
  }

export const getMemberData = async (memberAccessToken) => {
    try{
      const response = await axios.get(`${link}/sell/member?memberAccessToken=${memberAccessToken}`);
      return response.data;
    }catch(error){
      throw error;
    }
  }

export const post_advt = async (data) => {
    try{    
        if(data){
            const response = await axios.post(`${admin_link}/advt`, data);
            return response.data;
        }
    }catch(e){
        throw e;
    }
}

export const get_advt = async (advt_page) => {
    try{
        if(advt_page){
            const response = await  axios.get(`${admin_link}/advt/${advt_page}`);
            return response.data;
        }else{
            const response = await  axios.get(`${admin_link}/advt`);
            return response.data;
        }
    }catch(e){
        throw e;
    }
}

export const delete_advt = async (id) => {
    try{
        if(id){
            const response = await  axios.delete(`${admin_link}/advt/${id}`);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const post_support_page_famous_areas = async (data) => {
    try{
        if(data){
            const response = await  axios.post(`${admin_link}/famous-areas`, data, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const get_support_page_famous_areas = async () => {
    try{
        const response = await axios.get(`${admin_link}/famous-areas`);
        return response.data;
    }catch(e){
        throw e;
    }
} 

export const get_merchant_users = async () => {
    try{
        const response = await axios.get(`${link}/merchants`);
        return response.data;
    }catch(e){
        throw e;
    }
} 

export const delete_support_page_famous_areas = async (data) => { 
    try {
        if (data) {
            const response = await axios.delete(`${admin_link}/famous-area`, {
                data: data // Correct way to send data in DELETE request
            });
            return response.data;
        }
    } catch (e) {
        throw e;
    }
};

export const delete_user = async (user_id) => {
    try{
        if(user_id){
            const response = await axios.delete(`${admin_link}/user/${user_id}`);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const get_departments = async () => {
    try{
        const response = await axios.get(`${admin_roles_api}/departments`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_permissions = async () => {
    try{
        const response = await axios.get(`${admin_roles_api}/permissions`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_staff_types = async () => {
    try{
        const response = await axios.get(`${admin_roles_api}/staff-types`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_role_employees = async () => {
    try{
        const response = await axios.get(`${admin_roles_api}/employees`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_staff = async (token) => {
    try{
        const response = await axios.get(`${admin_roles_api}/staff/${token}`);
        return response.data;
    }catch(e){
        throw e;
    }
}
export const get_staff_with_type = async (token, staff_type) => {
    try{
        console.log(token, staff_type);
        const response = await axios.get(`${admin_roles_api}/staff-with-type/${token}/${staff_type}`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const send_otp_to_email = async (data) => {
  try {
    if (data) {
      const response = await axios.post(`${link}/sell/username-otp`, data);
      return response.data;
    }
  } catch (e) {
    throw e;
  }
}

export const check_email_exists = async (email) => {
  try {
    if (email) {
      const response = await axios.get(`${admin_roles_api}/check-email/${email}`);
      return response.data;
    }
  } catch (e) {
    throw e;
  }
}

export const post_role_employees = async (data) => {
    try{
        if(data){
            const response = await  axios.post(`${admin_roles_api}/create-role`, data);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const post_staff_email_otp = async (data) => {
    try{
        if(data){
            const response = await  axios.post(`${admin_roles_api}/staff-email-otp`, data);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const post_verify_staff_email_otp = async (data) => {
    try{
        if(data){
            const response = await  axios.post(`${admin_roles_api}/verify-staff-email-otp`, data);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const post_create_staff = async (data) => {
    try{
        if(data){
            const response = await  axios.put(`${admin_roles_api}/create-staff`, data);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const post_create_staff_tasks = async (data) => {
    try{
        if(data){
            const response = await  axios.post(`${admin_roles_api}/create-staff_task`, data);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const get_staff_task_with_token = async (token) => {
    try{
        const response = await axios.get(`${admin_roles_api}/staff-task-detail/${token}`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const post_task_report_details = async (data) => {
    try{
        if(data){
            const response = await  axios.post(`${admin_roles_api}/task-report-details`, data);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const put_replaceManagerAndDeleteEmployee = async (data) => {
    try{
        if(data){
            const response = await  axios.put(`${admin_roles_api}/replace-and-update-employee`, data);
            return response.data;
        }
    }catch(e){
        throw e;
    }
} 

export const get_staff_member_tasks = async (assigned_by, assigned_to) => {
    try{
        const response = await axios.get(`${admin_roles_api}/tasks/${assigned_by}/${assigned_to}`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_staff_task_report_details = async (task_id, task_reporting_date) => {
    try{
        const response = await axios.get(`${admin_roles_api}/staff-task-report/${task_id}/${task_reporting_date}`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const get_staff_member_task_report_details = async (task_id, task_reporting_date) => {
    try{
        const response = await axios.get(`${admin_roles_api}/staff-member-task-report-details/${task_id}/${task_reporting_date}`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const delete_auth_credentials = async (credentials_id) => {
    try{
        const response = await axios.delete(`${admin_roles_api}/delete-credentials/${credentials_id}`);
        return response.data;
    }catch(e){
        throw e;
    }
}

export const fetchDomains = async () => {
  const response = await axios.get(`${link}/domains`);
  return response.data;
};

export const fetchDomainSectors = async (domain_id) => {
  const response = await axios.get(`${link}/domain-sectors/${domain_id}`);
  return response.data;
};