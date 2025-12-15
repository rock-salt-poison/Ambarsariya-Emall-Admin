import React, { useEffect, useState } from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import FormFields from '../../../Form/FormFields';
import CustomSnackbar from "../../../CustomSnackbar";
import { get_permissions, get_staff_types, get_userByToken, post_create_staff, post_staff_email_otp, post_verify_staff_email_otp, send_otp_to_email } from '../../../../API/expressAPI';
import { useDispatch, useSelector } from "react-redux";
import { clearOtp, setEmailOtp } from '../../../../store/otpSlice';

const AddStaffForm = ({ onClose }) => {

  const [formData, setFormData] = useState({
    staff_type: '',
    username: '',
    password: '',
    confirm_password: '',
    name: '',
    phone: '',
    phone_otp: '',
    email: '',
    email_otp: '',
    age: '',
    start_date: '',
    assign_area:'',
    assign_area_name:'',
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [staffTypes, setStaffTypes] = useState([]);
  const [manager, setManager] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staffId, setStaffId] = useState(null);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [emailVerified, setEmailVerified] = useState(false);
  

  const dispatch = useDispatch();
  const reduxEmailOTP = useSelector(state => state.otp.emailOtp) || '';

  // Patterns
  const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const phonePattern = /^\+91\s\d{5}-\d{5}$/;

  // Fetch user by token
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const resp = await get_userByToken(token);
          if (resp?.user) {
            setManager(resp.user);
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

  // Handle Input Change
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Reset errors while typing
    setErrors(prev => ({ ...prev, [name]: "" }));
  };


  // VALIDATION FUNCTION
  const validateFields = () => {
    const newErrors = {};
    let valid = true;

    if (!formData.staff_type) { newErrors.staff_type = "Staff Type is required"; valid = false; }
    if (!formData.username) { newErrors.username = "Username is required"; valid = false; }
    if (!formData.name) { newErrors.name = "Name is required"; valid = false; }
    if (!formData.age) { newErrors.age = "Age is required"; valid = false; }
    if (!formData.start_date) { newErrors.start_date = "Start date is required"; valid = false; }
    if (!formData.assign_area) { newErrors.assign_area = "Asisgn area is required"; valid = false; }
    if (!formData.assign_area_name) { newErrors.assign_area = "Asisgn area name is required"; valid = false; }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passwordPattern.test(formData.password)) {
      newErrors.password = "Minimum 8 characters & 1 special character";
      valid = false;
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Confirm password is required";
      valid = false;
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
      valid = false;
    }

    // EMAIL VALIDATION
    if (formData.email && !gmailPattern.test(formData.email)) {
      newErrors.email = "Enter valid Gmail address";
      valid = false;
    }

    // IF OTP IS SENT, VALIDATE EMAIL OTP
    if (reduxEmailOTP && formData.email) {
      if (showEmailOtp && !formData.email_otp) {
        newErrors.email_otp = "Enter Email OTP";
        valid = false;
      } else if (showEmailOtp && formData.email_otp !== reduxEmailOTP) {
        newErrors.email_otp = "Invalid Email OTP";
        valid = false;
      }
    }

    // PHONE VALIDATION
    if (formData.phone && !phonePattern.test(formData.phone)) {
      newErrors.phone = "Phone must be +91 12345-12345";
      valid = false;
    }

    if (formData.phone) {
      if (showPhoneOtp && !formData.phone_otp) {
        newErrors.phone_otp = "Enter Phone OTP";
        valid = false;
      } else if (showPhoneOtp && formData.phone_otp !== "123456") {
        newErrors.phone_otp = "Invalid Phone OTP";
        valid = false;
      }
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
    } catch (err) { console.log(err); }
    finally{
      setLoading(false);
    }
  };

  // const fetchPermissions = async () => {
  //   try {
  //     setLoading(true);
  //     const resp = await get_permissions();
  //     setPermissions(resp || []);
  //   } catch (err) { console.log(err); }
  //   finally{
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchStaffTypes();
    // fetchPermissions();
  }, []);

  console.log(errors);
  

  // SUBMIT HANDLER
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const isValid = validateFields();
  //   if (!isValid) return;

  //   try {
  //     setLoading(true);
  //     const department_id = departments?.filter(d => d.department_name === formData?.department)?.[0].department_id;
  //     const permission_id = permissions?.filter(p => p.permission_name === formData?.rights)?.[0].permission_id;

  //     // SHOW PHONE OTP ONLY IF PHONE IS VALID
  //     if (formData.phone && phonePattern.test(formData.phone)) {
  //       setShowPhoneOtp(true);
  //     }

  //     // SHOW EMAIL OTP ONLY IF EMAIL IS VALID
  //     if (formData.email && gmailPattern.test(formData.email)) {
  //       setShowEmailOtp(true);

  //       // If OTP not sent yet -> send it now
  //       if (!reduxEmailOTP) {
  //         const resp = await send_otp_to_email({ username: formData.email });

  //         if (resp?.otp) {
  //           dispatch(setEmailOtp(resp.otp));
  //           setSnackbar({
  //             open: true,
  //             message: "OTP sent to email",
  //             severity: "success",
  //           });
  //         }
  //         return; // stop here until user enters OTP
  //       }
  //     }

  //     if (showPhoneOtp && formData.phone_otp !== "123456") {
  //     setSnackbar({
  //       open: true,
  //       message: "Invalid phone OTP",
  //       severity: "error",
  //     });
  //     return;
  //   }

  //   if (showEmailOtp && formData.email_otp !== reduxEmailOTP) {
  //     setSnackbar({
  //       open: true,
  //       message: "Invalid email OTP",
  //       severity: "error",
  //     });
  //     return;
  //   }

  //     const data = {
  //       department: department_id,
  //       role_name: formData?.role_name,
  //       rights: permission_id,
  //       username: formData?.username,
  //       password: formData?.password,
  //       name: formData?.name,
  //       phone: formData?.phone,
  //       email: formData?.email,
  //       age: formData?.age,
  //       start_date: formData?.start_date,
  //     }
  //     const response = await post_role_employees(data);
  //     if(response){
  //       console.log(response);
  //       setSnackbar({
  //         open: true,
  //         message: "Employee created successfully!",
  //         severity: "success",
  //       });
  //     }

  //     // call your final insert API here
  //     onClose();
  //   } catch (err) {
  //     console.log(err);
  //     setSnackbar({
  //       open: true,
  //       message: "Something went wrong",
  //       severity: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  console.log(manager);
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  const isValid = validateFields();
  if (!isValid) return;

  try {
    setLoading(true);

    const staff_type_id = staffTypes?.find(s => s.staff_type_name === formData.staff_type)?.id;
    console.log(staff_type_id);
    

    let otpStepTriggered = false;

    // -------------------------------
    // STEP 1 → SHOW PHONE OTP (if valid)
    // -------------------------------
    if (formData.phone && phonePattern.test(formData.phone)) {
      if (!showPhoneOtp) {
        setShowPhoneOtp(true);
        otpStepTriggered = true;
      }
    }

    // SHOW EMAIL OTP ONLY IF EMAIL IS VALID
      if (formData.email && gmailPattern.test(formData.email)) {
        setShowEmailOtp(true);
        otpStepTriggered = true;


        // If OTP not sent yet -> send it now
        if (!staffId) {
          try{
            setLoading(true);
            setSnackbar({
                open: true,
                message: "Sending OTP to email",
                severity: "success",
              });
            const resp = await send_otp_to_email({ username: formData.email });
            console.log(resp);
            
            if (resp?.otp) {
              
              const store_otp_resp = await post_staff_email_otp({
                manager_id: manager?.id,
                email: formData?.email,
                email_otp: resp?.otp
              })

              if(store_otp_resp?.success){
                setSnackbar({
                  open: true,
                  message: "OTP sent to email",
                  severity: "success",
                });
                setStaffId(store_otp_resp?.staff_id);
              }
            }
            otpStepTriggered = true;
  
            return; // stop here until user enters OTP
          }catch(e){
            console.log(e);
          }finally{
            setLoading(false);
          }
        }
      }

    // -------------------------------
    // STEP 3 → VALIDATE BOTH OTPs TOGETHER
    // -------------------------------
    if (showPhoneOtp && formData.phone_otp !== "123456") {
      setSnackbar({
        open: true,
        message: "Invalid phone OTP",
        severity: "error",
      });
      return;
    }

    if (staffId && !emailVerified) {

      const verify_otp_resp = await post_verify_staff_email_otp({
        staff_id : staffId, 
        manager_id: manager?.id, 
        email: formData?.email, 
        email_otp: formData?.email_otp
      })
      if(verify_otp_resp?.success){
        setSnackbar({
        open: true,
        message: verify_otp_resp?.message,
        severity: "success",
      });
      setEmailVerified(true);
      }else{
        setSnackbar({
          open: true,
          message: "Invalid email OTP",
          severity: "error",
        });
      }
      return;
    }

    // -------------------------------
    // STEP 4 → FINAL API CALL (ONLY NOW)
    // -------------------------------

    const payload = {
      staff_id: staffId,
      manager_id: manager?.id,
      staff_type_id: staff_type_id,
      username: formData.username,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      age: formData.age,
      start_date: formData.start_date,
      assign_area: formData.assign_area,
      assign_area_name: formData.assign_area_name,
    };

    try{
      setLoading(true);

      const response = await post_create_staff(payload);
      console.log(response);
      
      if (response) {
        setSnackbar({
          open: true,
          message: "Staff created successfully!",
          severity: "success",
        });
        dispatch(clearOtp());

        onClose();
      }
    }catch(e){
      console.log(e);
    }
    finally{
      setLoading(false);
    }

  } catch (err) {
    console.log(err);
    setSnackbar({
      open: true,
      message: "Something went wrong",
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};

console.log(staffTypes);

console.log(formData?.assign_area);



  // // SHOW OTP ONLY WHEN EMAIL IS VALID AND OTP WAS SENT
  // const showEmailOtp = reduxEmailOTP && formData.email && !errors.email;

  // // PHONE OTP only if phone valid
  // const showPhoneOtp = formData.phone && !errors.phone;


  // FIELDS
  const formFields = [
    { id: 1, label: 'Select Sale Staff', name: 'staff_type', type: 'select', options: staffTypes.map(s => s.staff_type_name) },
    { id: 2, label: 'Enter name', name: 'name', type: 'text' },
    { id: 3, label: 'Enter age', name: 'age', type: 'number' },
    { id: 4, label: 'Start Date', name: 'start_date', type: 'date' },
    { id: 5, label: 'Enter phone no.', name: 'phone', type: 'text' },

    ...(showPhoneOtp ? [
      { id: 6, label: "Enter Phone OTP", name: "phone_otp", type: "text" }
    ] : []),

    { id: 7, label: 'Enter email id', name: 'email', type: 'email' },

    ...(showEmailOtp ? [
      { id: 8, label: "Enter Email OTP", name: "email_otp", type: "text" }
    ] : []),

    { id: 9, label: 'Enter username', name: 'username', type: 'text' },
    { id: 10, label: 'Enter Password', name: 'password', type: 'password' },
    { id: 11, label: 'Confirm Password', name: 'confirm_password', type: 'password' },
    { id: 12, label: 'Assign Area', name: 'assign_area', type: 'address' },
    { id: 13, label: 'Assign Area Name', name: 'assign_area_name', type: 'text' },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {loading && <Box className="loading"><CircularProgress /></Box> }

      {formFields.map(field => (
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
        />
      ))}

      <Button type="submit" variant="contained">Create</Button>

      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default AddStaffForm;
