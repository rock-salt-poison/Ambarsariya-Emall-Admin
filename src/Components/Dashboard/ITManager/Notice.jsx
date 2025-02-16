import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FormFields from "../../Form/FormFields";
import CustomSnackbar from "../../CustomSnackbar";
import { post_notice } from "../../../API/expressAPI";
import { useNavigate } from "react-router-dom";

function Notice({ page, fieldsData, title }) {
  const [category, setCategory] = useState(fieldsData[0]); // Default category
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  // Generate initial form data based on fields
  const generateInitialData = (fields) => {
    const data = {};
    fields.forEach((field) => {
      data[field.name] = field.value || (field.type === "file" ? null : "");
    });
    return data;
  };

  // Handle category change
  const handleCategoryChange = (key) => {
    const fields = fieldsData[key] || [];
    setCategory(key);
    setFormData({
      ...generateInitialData(fields),
    });
  };

  // Handle input changes for text, number, etc.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        img: file, // Store the actual file in state
      }));
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};

    // Validate required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value && key !== "img") {
        formErrors[key] = `${key} is required`;
      }
    });

    // Check if the file is missing
    if (!formData.img) {
      formErrors.img = "Image is required";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if (key === "date_range" && Array.isArray(value)) {
            data.append("from_date", new Date(value[0]).toLocaleString().split("T")[0]);
            data.append("to_date", new Date(value[1]).toLocaleString().split("T")[0]);
          } else {
            data.append(key, value);
          }
        });

        data.append("title", title);

        // Call the API
        const resp = await post_notice(data);

        // Show success message
        setSnackbar({
          open: true,
          message: resp ? "Details stored successfully." : "Failed to store details.",
          severity: resp ? "success" : "error",
        });
        setTimeout(()=> {
          navigate('../todo');
        }, 2500);
      } catch (e) {
        console.error("Error during notice submission:", e);
        console.log(e.response.data.error);
        
        if(e.response.data.error==="File size exceeds the 1MB limit."){
          setSnackbar({
            open: true,
            message: "File size should not exceed the 1MB limit.",
            severity: "error",
          });
        }else{
          setSnackbar({
            open: true,
            message: "Failed to store details.",
            severity: "error",
          });
        }
      }
    }
  };

  // Initialize the form data based on the selected category
  useEffect(() => {
    handleCategoryChange(page);
  }, [page]);

  const fields = fieldsData[category] || [];

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
      className="form2"
    >
      {[...fields].map((field) => (
        <React.Fragment key={field.id}>
          <FormFields
            label={field.label}
            name={field.name}
            value={field.type !== "file" ? formData[field.name] || "" : undefined}            type={field.type}
            options={field.options}
            error={!!errors[field.name]}
            onChange={field.type === "file" ? handleFileChange : handleChange} // Handle file or text changes
            helperText={errors[field.name]}
            optionalCname={field.cName}
            required={field.required}
          />
        </React.Fragment>
      ))}

      {fields.length > 0 && (
        <Button type="submit" variant="contained" className="btn_submit">
          Save
        </Button>
      )}

      <Typography className="note">
      Note: Only JPEG, PNG, WEBP, and PDF files are allowed. Maximum file size: <Typography variant="span">1MB</Typography>.
      </Typography>

      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}

export default Notice;