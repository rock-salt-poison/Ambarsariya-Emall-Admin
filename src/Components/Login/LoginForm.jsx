import React, { useState } from "react";
import FormFields from "../Form/FormFields";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdminToken } from "../../store/authSlice";
import CustomSnackbar from "../CustomSnackbar";

function LoginForm() {
  const initialData = {
    email: "",
    password: "",
  };

  const formFields = [
    {
      id: 1,
      label: "Email",
      name: "email",
      type: "email",
    },
    {
      id: 2,
      label: "Password",
      name: "password",
      type: "password",
    },
  ];

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({}); // State to track errors
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation (example)
    let formErrors = {};
    if (!formData.email) formErrors.email = "Email is required";
    if (!formData.password) formErrors.password = "Password is required";

    setErrors(formErrors);

    // If no errors, submit form
    if (Object.keys(formErrors).length === 0) {
      if (formData.email.toLowerCase() == "admin@ambarsariyamall.com") {
        dispatch(setAdminToken("Admin"));
        localStorage.setItem("token", "Admin");
        setTimeout(() => {
          navigate("../");
        }, 1000);
        setSnackbar({ open: true, message: "Login successful" });
      } else if (formData.email.toLowerCase() == "it@ambarsariyamall.com") {
        dispatch(setAdminToken("IT Manager"));
        localStorage.setItem("token", "IT Manager");
        setTimeout(() => {
          navigate("../");
        }, 1000);
        setSnackbar({ open: true, message: "Login successful" });
      } else {
        setSnackbar({ open: true, message: "Invalid credentials!" });
      }
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
          onChange={(e) => handleChange(e)}
          error={!!errors[field.name]}
          helperText={errors[field.name]}
        />
      ))}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        className="btn_submit"
      >
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
