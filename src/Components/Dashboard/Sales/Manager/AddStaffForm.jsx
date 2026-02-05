import React, { useEffect, useState } from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import FormFields from '../../../Form/FormFields';
import CustomSnackbar from "../../../CustomSnackbar";
import { check_email_exists, get_permissions, get_staff_types, get_userByToken, get_managers_by_department, post_create_sales_staff, post_staff_email_otp, post_verify_staff_email_otp, send_otp_to_email, send_member_phone_otp, verify_member_phone_otp } from '../../../../API/expressAPI';
import { useDispatch, useSelector } from "react-redux";
import { clearOtp, setEmailOtp } from '../../../../store/otpSlice';

const AddStaffForm = ({ onClose }) => {

  const [formData, setFormData] = useState({
    manager: '',
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
  const [credentialsId, setCredentialsId] = useState(null);
  
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [managers, setManagers] = useState([]);
  

  const dispatch = useDispatch();
  const reduxEmailOTP = useSelector(state => state.otp.emailOtp) || '';

  // Patterns
  const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const phonePattern = /^\+91\s\d{5}-\d{5}$/;

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
          const resp = await get_managers_by_department('Sales Manager', token);
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

    if (isAdmin && !formData.manager) { newErrors.manager = "Manager is required"; valid = false; }
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

  useEffect(() => {
    fetchStaffTypes();
  }, []);

  console.log(errors);

  // Resend phone OTP function
  const handleResendPhoneOtp = async () => {
    try {
      setLoading(true);
      const phoneData = { phoneNumber: formData.phone, user_type: 'staff' };
      const phone_otp_resp = await send_member_phone_otp(phoneData);
      if (phone_otp_resp?.success) {
        setSnackbar({
          open: true,
          message: phone_otp_resp.message || "OTP resent successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: phone_otp_resp.message || "Failed to resend OTP",
          severity: "error",
        });
      }
    } catch (e) {
      setSnackbar({
        open: true,
        message: e.response?.data?.message || "Failed to resend OTP",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateFields()) return;

  try {
    setLoading(true);

    const staff_type_id = staffTypes?.find(
      s => s.staff_type_name === formData.staff_type
    )?.id;

    /* ---------------- PHONE OTP FLOW ---------------- */
    if (formData.phone && phonePattern.test(formData.phone) && !phoneVerified) {
      // Send phone OTP if not sent yet
      if (!phoneOtpSent) {
        try {
          const phoneData = { phoneNumber: formData.phone, user_type: 'staff' };
          const phoneOtpResp = await send_member_phone_otp(phoneData);
          
          if (phoneOtpResp?.success) {
            setPhoneOtpSent(true);
            setShowPhoneOtp(true);
            setSnackbar({
              open: true,
              message: phoneOtpResp.message || "OTP sent to phone successfully",
              severity: "success",
            });
          } else {
            setSnackbar({
              open: true,
              message: phoneOtpResp.message || "Failed to send OTP",
              severity: "error",
            });
          }
        } catch (e) {
          console.error("Error sending phone OTP:", e);
          setSnackbar({
            open: true,
            message: e.response?.data?.message || "Failed to send OTP",
            severity: "error",
          });
        }
        setLoading(false);
        return;
      }

      // Verify phone OTP if sent but not verified
      if (phoneOtpSent && !phoneVerified && formData.phone_otp) {
        try {
          const verifyPhoneData = {
            phoneNumber: formData.phone,
            phone_otp: formData.phone_otp,
          };

          const verifyPhoneResp = await verify_member_phone_otp(verifyPhoneData);

          if (verifyPhoneResp?.success) {
            setPhoneVerified(true);
            setSnackbar({
              open: true,
              message: verifyPhoneResp.message || "Phone OTP verified successfully",
              severity: "success",
            });
          } else {
            setSnackbar({
              open: true,
              message: verifyPhoneResp.message || "Invalid or expired OTP",
              severity: "error",
            });
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Error verifying phone OTP:", e);
          setSnackbar({
            open: true,
            message: e.response?.data?.message || "OTP verification failed",
            severity: "error",
          });
          setLoading(false);
          return;
        }
      } else if (phoneOtpSent && !phoneVerified) {
        setLoading(false);
        return;
      }
    }

    let verifiedNow = emailVerified;
    let finalCredentialsId = credentialsId;

    /* ---------------- EMAIL FLOW ---------------- */
    if (!verifiedNow && gmailPattern.test(formData.email)) {

      // UX check only
      if (!finalCredentialsId) {
        const check = await check_email_exists(formData.email);

        if (check?.email_is_registered) {
          setSnackbar({
            open: true,
            message: "Email already registered",
            severity: "error",
          });
          setLoading(false);
          return;
        }

        // Request OTP (backend handles everything)
        const otpResp = await post_staff_email_otp({
          email: formData.email
        });

        if (otpResp?.success) {
          setShowEmailOtp(true);
          setCredentialsId(otpResp.credentials_id);
          setSnackbar({
            open: true,
            message: otpResp.message,
            severity: "success",
          });
        }

        setLoading(false);
        return;
      }

      // Verify OTP
      if (!formData.email_otp) {
        setLoading(false);
        return;
      }

      const verifyResp = await post_verify_staff_email_otp({
        email: formData.email,
        email_otp: formData.email_otp,
      });

      if (!verifyResp?.success) {
        setSnackbar({
          open: true,
          message: verifyResp.message || "Invalid or expired OTP",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      verifiedNow = true;
      finalCredentialsId = verifyResp.credentials_id;

      setEmailVerified(true);
      setCredentialsId(finalCredentialsId);

      setSnackbar({
        open: true,
        message: verifyResp.message,
        severity: "success",
      });
    }

    /* ---------------- FINAL CREATE ---------------- */
    if (!verifiedNow || !finalCredentialsId || (formData.phone && phonePattern.test(formData.phone) && !phoneVerified)) {
      setLoading(false);
      return;
    }

    // If admin, use selected manager's ID, otherwise use logged-in manager's ID
    let manager_id = manager?.id;
    if (isAdmin && formData.manager) {
      const selectedManager = managers.find(m => m.name === formData.manager);
      manager_id = selectedManager?.id || manager?.id;
    }

    const payload = {
      credentials_id: finalCredentialsId,
      manager_id: manager_id,
      staff_type_id,
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

    const response = await post_create_sales_staff(payload);

    if (response?.success) {
      setSnackbar({
        open: true,
        message: "Staff created successfully!",
        severity: "success",
      });
      setTimeout(() => onClose(), 1000);
    }

  } catch (err) {
    console.error(err);
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

  // FIELDS
  const formFields = [
    ...(isAdmin ? [{
      id: 0,
      label: 'Select Manager',
      name: 'manager',
      type: 'select',
      options: managers.map(m => m.name),
      cName: 'w-100',
    }] : []),
    { id: 1, label: 'Select Sale Staff', name: 'staff_type', type: 'select', options: staffTypes.map(s => s.staff_type_name) },
    { id: 2, label: 'Enter name', name: 'name', type: 'text' },
    { id: 3, label: 'Enter age', name: 'age', type: 'number' },
    { id: 4, label: 'Start Date', name: 'start_date', type: 'date' },
    { id: 5, label: 'Enter phone no.', name: 'phone', type: 'phone_number' },

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

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained">Create</Button>
        {showPhoneOtp && !phoneVerified && (
          <Button
            variant="outlined"
            onClick={handleResendPhoneOtp}
            disabled={loading}
          >
            Resend Phone OTP
          </Button>
        )}
      </Box>

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
