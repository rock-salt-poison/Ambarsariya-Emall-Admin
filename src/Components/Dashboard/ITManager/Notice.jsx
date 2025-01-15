import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import FormFields from "../../Form/FormFields";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";
import { post_notice } from "../../../API/expressAPI";

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

  const generateInitialData = (fields) => {
    const data = {};
    fields.forEach((field) => {
      data[field.name] = field.value || "";
    });
    return data;
  };

  const handleCategoryChange = (key) => {
    const fields = fieldsData[key] || [];
    setCategory(key);
    setFormData({
      ...generateInitialData(fields),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};

    Object.keys(formData).forEach((field) => {
      if (!formData[field] && !Array.isArray(formData[field])) {
        formErrors[field] = `${field} is required`;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
        console.log(new Date(formData.date_range[0]).toLocaleDateString("en-CA"));
        if (title) {
          try {
            const {
              to,
              date_range,
              time,
              location,
              entry_fee,
              img,
              message,
            } = formData; // Destructure formData here
  
            const data = {
              ...formData,
              title,
              to,
              from_date: new Date(date_range[0]).toLocaleDateString("en-CA"), // Assuming date_range is an array
              to_date: new Date(date_range[1]).toLocaleDateString("en-CA"),   // Assuming date_range is an array
              time,
              location,
              entry_fee,
              img,
              message,
            };
  
            const resp = await post_notice(data);
            setSnackbar({
              open: true,
              message: resp ? "Details stored successfully." : "Failed to store details.",
              severity: resp ? "success" : "error",
            });
          } catch (e) {
            setSnackbar({ open: true, message: "Failed to store details.", severity: "error" });
          }
        }
      }
    };

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
      {fields.map((field) => (
        <React.Fragment key={field.id}>
          <FormFields
            label={field.label}
            name={field.name}
            value={formData[field.name]} // Bind value to formData
            type={field.type}
            options={field.options}
            error={!!errors[field.name]}
            onChange={handleChange} // Pass the onChange handler
            helperText={errors[field.name]}
            optionalCname={field.cName}
            required={true}
          />
        </React.Fragment>
      ))}

      {fields.length > 0 && (
        <Button type="submit" variant="contained" className="btn_submit">
          Save
        </Button>
      )}

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
