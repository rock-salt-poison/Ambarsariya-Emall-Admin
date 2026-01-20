import React, { useEffect, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import FormFields from "../../../Form/FormFields";
import CustomSnackbar from "../../../CustomSnackbar";
import {
  get_permissions,
  get_staff_types,
  get_staff_with_type,
  get_support_page_famous_areas,
  get_userByToken,
  get_managers_by_department,
  get_manager_token_by_id,
  post_create_staff,
  post_create_staff_tasks,
  post_staff_email_otp,
  post_verify_staff_email_otp,
  send_otp_to_email,
} from "../../../../API/expressAPI";
import { useDispatch, useSelector } from "react-redux";
import { clearOtp, setEmailOtp } from "../../../../store/otpSlice";
import dayjs from "dayjs";

const AssignTaskForm = () => {
  const initialData = {
    manager: "",
    staff_type: "",
    staff_member: "",
    assigned_task: "",
    task_date: "",
    location: "",
    assign_area: "",
    approx_shops: "",
    approx_offices: "",
    approx_hawkers: "",
    assign_daily_task: "",
    daily_task_date: "",
    daily_location: "",
  };
  const [formData, setFormData] = useState(initialData);

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [staffTypes, setStaffTypes] = useState([]);
  const [manager, setManager] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [staffMembers, setStaffMembers] = useState([]);
  const [famousAreas, setFamousAreas] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [managers, setManagers] = useState([]);
  const [selectedManagerToken, setSelectedManagerToken] = useState(null);

  useEffect(() => {
    const tokenToUse = isAdmin ? selectedManagerToken : token;
    
    if (tokenToUse && formData?.staff_type && (!isAdmin || formData.manager)) {
      const fetchEmployees = async () => {
        try {
          setLoading(true);

          const resp = await get_staff_with_type(tokenToUse, formData.staff_type);
          if (resp) {
            setStaffMembers(resp);
          }
        } catch (e) {
          console.log(e);
          setStaffMembers([]);
        } finally {
          setLoading(false);
        }
      };

      fetchEmployees();
    } else {
      setStaffMembers([]);
    }
  }, [token, selectedManagerToken, formData?.staff_type, formData?.manager, isAdmin]);

  useEffect(() => {
    if (!formData.staff_member) return;

    const selectedStaff = staffMembers.find(
      (s) => s.name === formData.staff_member
    );

    if (selectedStaff?.assign_area) {
      setFormData((prev) => ({
        ...prev,
        location: selectedStaff.assign_area, // full object
      }));
    }
  }, [formData.staff_member, staffMembers]);

  // Fetch user by token and check if admin
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const resp = await get_userByToken(token);
          if (resp?.user) {
            setManager(resp.user);
            setIsAdmin(resp.user.department_name === 'Admin');
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch managers if admin
  useEffect(() => {
    if (isAdmin && token) {
      const fetchManagers = async () => {
        try {
          setLoading(true);
          const resp = await get_managers_by_department('Marketing Manager', token);
          if (resp) {
            setManagers(resp);
          }
        } catch (e) {
          console.error(e);
          setManagers([]);
        } finally {
          setLoading(false);
        }
      };
      fetchManagers();
    }
  }, [isAdmin, token]);

  // Fetch manager token when manager is selected
  useEffect(() => {
    if (isAdmin && formData.manager) {
      const selectedManager = managers.find(m => m.name === formData.manager);
      if (selectedManager?.access_token) {
        setSelectedManagerToken(selectedManager.access_token);
      } else if (selectedManager?.id) {
        const fetchToken = async () => {
          try {
            const resp = await get_manager_token_by_id(selectedManager.id);
            if (resp?.access_token) {
              setSelectedManagerToken(resp.access_token);
            }
          } catch (e) {
            console.error(e);
          }
        };
        fetchToken();
      }
    } else if (!isAdmin) {
      setSelectedManagerToken(token);
    }
  }, [formData.manager, managers, isAdmin, token]);

  

  // Handle Input Change
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Reset dependent fields when manager changes
      if (name === 'manager' && isAdmin) {
        newData.staff_type = '';
        newData.staff_member = '';
        setStaffMembers([]);
      }
      return newData;
    });

    // Reset errors while typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // VALIDATION FUNCTION
  const validateFields = () => {
    const newErrors = {};
    let valid = true;

    if (!formData.staff_type) {
      newErrors.staff_type = "Staff Type is required";
      valid = false;
    }
    if (!formData.assign_area) {
      newErrors.assign_area = "Asisgn area is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Fetch API data
  const fetchStaffTypes = async () => {
    try {
      setLoading(true);
      const resp = await get_staff_types();
      setStaffTypes(resp || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffTypes();
  }, []);

  console.log(errors);

  useEffect(()=>{
    const fetchFamousAreas = async () => {
      try{
        setLoading(true);
        const resp = await get_support_page_famous_areas();
        if(resp){
          setFamousAreas(resp);
        }
      }catch(e){
        console.log(e); 
      }finally{
        setLoading(false);
      }
    }
    fetchFamousAreas(); 
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateFields();
    if (!isValid) return;

    try {
      setLoading(true);

      const assigned_to = staffMembers.find(
        (s) => s.name === formData.staff_member
      )?.id;

      // If admin, use selected manager's ID, otherwise use logged-in manager's ID
      let assigned_by = manager?.id;
      if (isAdmin && formData.manager) {
        const selectedManager = managers.find(m => m.name === formData.manager);
        assigned_by = selectedManager?.id || manager?.id;
      }

      const start_date = dayjs(formData?.task_date?.[0]).format('YYYY-MM-DD');
      const end_date = dayjs(formData?.task_date?.[1]).format('YYYY-MM-DD');
      const assign_areas = formData?.assign_area?.map((a) => {
      const fa = famousAreas?.find(fa => fa.area_address === a);

      return fa
        ? {
            latitude: fa.latitude,
            longitude: fa.longitude,
            description: fa.area_address,
            length_in_km: fa.length_in_km,
          }
        : null;
      });

      const data = {
        assigned_by,
        assigned_to,
        assigned_task: formData?.assigned_task,
        start_date,
        end_date,
        assign_area: assign_areas,
        approx_shops: formData?.approx_shops,
        approx_offices: formData?.approx_offices,
        approx_hawkers: formData?.approx_hawkers,
        assign_daily_task: formData?.assign_daily_task,
        choose_date: formData?.daily_task_date,
        daily_location: formData?.daily_location,
      };

      if (data) {
        const resp = await post_create_staff_tasks(data);
        if (resp?.success) {
          console.log(resp);
          setSnackbar({
            open: true,
            message: resp?.message,
            severity: "success",
          });
          setTimeout(() => {
            setFormData(initialData);
          }, 300);
        }
      }
    } catch (e) {
      console.log(e);

      setSnackbar({
        open: true,
        message: "Failed to assign the task",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // FIELDS
  const formFields = [
    ...(isAdmin ? [{
      id: 0,
      label: "Select Manager",
      name: "manager",
      type: "select",
      options: managers.map((m) => m.name),
      cName: 'w-30',
    }] : []),
    {
      id: 1,
      label: "Select Staff",
      name: "staff_type",
      type: "select",
      options: staffTypes.map((s) => s.staff_type_name),
      cName:'w-30',
      disable: isAdmin && !formData.manager,
    },
    {
      id: 2,
      label: "Select Staff Member",
      name: "staff_member",
      type: "select",
      options: staffMembers.length>0 ?  staffMembers.map((s) => s.name) : ['No staff members'],
      disable: staffMembers.length>0 ? false : true || (isAdmin && !formData.manager),
      cName:'w-30',
    },
    { id: 3, label: "Assign Task", name: "assigned_task", type: "textarea" },
    { id: 4, label: "Task Date", name: "task_date", type: "date-range", cName: 'flex-auto'},
    {
      id: 5,
      label: "Location",
      name: "location",
      type: "address",
      cName: "flex-1",
      readOnly: true,
    },
    {
      id: 6,
      label: "Assign area",
      name: "assign_area",
      type: "multi-select-checkbox",
      options:famousAreas?.map((fa)=>fa.area_address),
      cName: "w-100",
      multiple: true,
    },
    { id: 7, label: "Approx. shops", name: "approx_shops", type: "number", cName: "w-30", },
    { id: 8, label: "Approx. offices", name: "approx_offices", type: "number" ,  cName: "w-30",},
    {
      id: 9,
      label: "Approx. hawkers or small huts (made up of cane wood)",
      name: "approx_hawkers",
      type: "number",
       cName: "w-30",
    },
    {
      id: 10,
      label: "Assign Daily Task",
      name: "assign_daily_task",
      type: "text",
    },
    {
      id: 11,
      label: "Choose Date",
      name: "daily_task_date",
      type: "date",
      cName: "flex-auto",
    },
    {
      id: 12,
      label: "Daily location",
      name: "daily_location",
      type: "address",
      cName: "flex-auto",
    },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} className="form2">
      {loading && (
        <Box className="loading">
          <CircularProgress />
        </Box>
      )}

      {formFields.map((field) => (
        <FormFields
          key={field.id}
          label={field.label}
          name={field.name}
          value={formData[field.name]}
          type={field.type}
          options={field.options}
          onChange={handleOnChange}
          error={!!errors[field.name]}
          helperText={errors[field.name]}
          optionalCname={field.cName}
          multiple={field.multiple}
          readOnly={field.readOnly}
          disable={field.disable}
        />
      ))}
      <Box sx={{width:'100%'}}>
        <Button type="submit" variant="contained">
          Create
        </Button>
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default AssignTaskForm;
