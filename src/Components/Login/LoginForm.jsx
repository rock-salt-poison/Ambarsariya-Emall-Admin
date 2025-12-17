import React, { useState } from "react";
import FormFields from "../Form/FormFields";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdminToken } from "../../store/authSlice";
import CustomSnackbar from "../CustomSnackbar";
import { authenticateUser } from "../../API/expressAPI";

function LoginForm() {
  const initialData = { username: "", password: "" };
  const formFields = [
    { id: 1, label: "Username", name: "username", type: "text" },
    { id: 2, label: "Password", name: "password", type: "password" },
  ];

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    let formErrors = {};
    if (!formData.username) formErrors.username = "Username is required";
    if (!formData.password) formErrors.password = "Password is required";
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      // Call your API to authenticate
      const response = await authenticateUser(formData);
      console.log(response);
      
      if (response.user_access_token) {
        // Store token in Redux
        dispatch(setAdminToken(response.user_access_token));

        setSnackbar({ open: true, message: "Login successful", severity: "success" });
        setTimeout(() => navigate("../"), 1000); // redirect after login
      } else {
        setSnackbar({ open: true, message: response.message || "Invalid credentials", severity: "error" });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Server error", severity: "error" });
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      {formFields.map((field) => (
        <FormFields
          key={field.id}
          label={field.label}
          name={field.name}
          type={field.type}
          value={formData[field.name]}
          onChange={handleChange}
          error={!!errors[field.name]}
          helperText={errors[field.name]}
        />
      ))}
      <Button type="submit" variant="contained" fullWidth className="btn_submit">
        Login
      </Button>
      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}

export default LoginForm;
