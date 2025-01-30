import React, { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import FormFields from "../../Form/FormFields";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";

const ADVT = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState([
    {
      id: 1,
      label: "ADVT 1",
      btn: 'Add',
      fields: [
        {
          id: 1,
          label: 'Shop',
          name: 'shop_1',
          type: 'text',
          required: true
        },
        {
          id: 2,
          label: 'Banner link',
          name: 'upload_banner_1',
          type: 'url',
          required: true
        }
      ]
    }
  ]);

  const navigate = useNavigate();

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  };

  // Add new fields dynamically
  const handleAddField = () => {
    const newIndex = formFields.length + 1;
    const newFields = [
      {
        id: newIndex * 2 - 1,
        label: 'Shop',
        name: `shop_${newIndex}`,
        type: 'text',
        required: true
      },
      {
        id: newIndex * 2,
        label: 'Banner link',
        name: `upload_banner_${newIndex}`,
        type: 'url',
        required: true
      }
    ];

    setFormFields((prevFields) => [
      ...prevFields,
      {
        id: newIndex,
        label: `ADVT ${newIndex}`,
        btn: 'Remove',
        fields: newFields
      }
    ]);
  };

  // Remove fields dynamically
  const handleRemoveField = (id) => {
    // Log to check if id is correct
    console.log("Removing field with id:", id);

    setFormFields((prevFields) => {
      // Remove the field based on the id
      return prevFields.filter((field) => field.id !== id);
    });
  };

  return (
    <Box component="form" autoComplete="off" onSubmit={handleSubmit} className="form2">
      {loading ? (
        <CircularProgress />
      ) : (
        formFields.map((field) => (
          <React.Fragment key={field.id}>
            <FormFields
              label={field.label}
              btn={field.btn}
              handleAddClick={field.btn === 'Add' ? handleAddField : undefined}
              handleRemoveClick={field.btn === 'Remove' ? () => handleRemoveField(field.id) : undefined}
            />
            <Box className="form-group">
              {field.fields.map((nestedField) => (
                <FormFields
                  key={nestedField.id}
                  label={nestedField.label}
                  name={nestedField.name}
                  value={formData[nestedField.name] || ""}
                  type={nestedField.type}
                  error={!!errors[nestedField.name]}
                  onChange={handleChange}
                  helperText={errors[nestedField.name]}
                  required={nestedField.required}
                />
              ))}
            </Box>
          </React.Fragment>
        ))
      )}

      <Button type="submit" variant="contained" className="btn_submit">
        Save
      </Button>

      <CustomSnackbar
        open={snackbar.open}
        handleClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default ADVT;
