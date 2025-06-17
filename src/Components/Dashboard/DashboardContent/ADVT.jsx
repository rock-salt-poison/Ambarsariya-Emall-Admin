import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import FormFields from "../../Form/FormFields";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";
import { delete_advt, get_advt, post_advt } from "../../../API/expressAPI";

const ADVT = ({ page }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState([
    {
      id: 1,
      label: "ADVT 1",
      btn: "Add",
      fields: [
        {
          id: 1,
          label: "Shop",
          name: "shop_1",
          type: "text",
          required: true,
        },
        {
          id: 2,
          label: "Select Background",
          name: "bg_1",
          type: "select",
          options: [
            "Coupon Frame",
            "Post Stamp Frame",
            "Turkey Stamp Frame",
            "Zig-zag Border",
            "Travel Postal Stamp",
          ],
          required: true,
        },
      ],
    },
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
    const formattedData = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        const match = key.match(/^(shop|bg)_(\d+)$/);
        if (match) {
          const [, type, index] = match;
          if (!acc[index]) acc[index] = { shop: "", bg: "" };
          if (type === "shop") acc[index].shop = value;
          if (type === "bg") acc[index].bg = value;
        }
        return acc;
      },
      {}
    );

    // Convert object to array and filter out incomplete pairs
    const result = Object.values(formattedData).filter(
      (item) => item.shop && item.bg
    );

    const data = {
      advt: result,
      advt_page: page,
    };

    if (result) {
      try {
        const resp = await post_advt(data);
        if (resp.message) {
          setSnackbar({
            open: true,
            message: resp.message,
          });
        }
      } catch (e) {
        console.log(e);
        setSnackbar({
          open: true,
          message: e.response.data.error,
        });
      }
    }
  };

  // Add new fields dynamically
  const handleAddField = () => {
    const newIndex = formFields.length + 1;
    const newFields = [
      {
        id: newIndex * 2 - 1,
        label: "Shop",
        name: `shop_${newIndex}`,
        type: "text",
        required: true,
      },
      {
        id: newIndex * 2,
        label: "Select Background",
        name: `bg_${newIndex}`,
        type: "select",
        options: [
          "Coupon Frame",
          "Post Stamp Frame",
          "Turkey Stamp Frame",
          "Zig-zag Border",
          "Travel Postal Stamp",
        ],
        required: true,
      },
    ];

    setFormFields((prevFields) => [
      ...prevFields,
      {
        id: newIndex,
        label: `ADVT ${newIndex}`,
        btn: "Remove",
        fields: newFields,
      },
    ]);
  };

 // Remove fields dynamically
const handleRemoveField = async (id) => {
  // Log to check if id is correct
  console.log("Removing field with id:", id);

  // Find the advertisement data to be removed
  const fieldToRemove = formFields.find((field) => field.id === id);
  if (fieldToRemove) {
    try {
      // Call API to delete the advertisement
      const response = await delete_advt(id); // Use the delete_advt function from API
      if (response.message) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
      }

      // Remove the specific field from formFields
      setFormFields((prevFields) => {
        const updatedFields = prevFields.filter((field) => field.id !== id);

        // Remove corresponding keys from formData
        fieldToRemove.fields.forEach((field) => {
          const fieldName = field.name;
          setFormData((prevData) => {
            const { [fieldName]: removedField, ...rest } = prevData;
            return rest; // Remove field from formData
          });
        });

        return updatedFields;
      });
    } catch (error) {
      console.error("Error removing advertisement:", error);
      setSnackbar({
        open: true,
        message: "Failed to remove advertisement.",
        severity: "error",
      });
    }
  }
};


useEffect(() => {
    fetch_advt_from_database();
  }, [page]);

  const fetch_advt_from_database = async () => {
  setLoading(true);

  try {
    const resp = await get_advt(page);

    if (resp?.message === 'Valid' && resp?.data?.length > 0) {
      const newFields = resp.data.map((ad, index) => {
        const newIndex = index + 1;

        return {
          id: ad.id ?? `advt_${newIndex}`,
          label: `ADVT ${newIndex}`,
          btn: newIndex === 1 ? "Add" : "Remove",
          fields: [
            {
              id: `shop_${newIndex}`,
              label: "Shop",
              name: `shop_${newIndex}`,
              type: "text",
              value: ad?.shop_no ?? "",
              required: true,
            },
            {
              id: `bg_${newIndex}`,
              label: "Select Background",
              name: `bg_${newIndex}`,
              type: "select",
              options: [
                "Coupon Frame",
                "Post Stamp Frame",
                "Turkey Stamp Frame",
                "Zig-zag Border",
                "Travel Postal Stamp",
              ],
              value: ad?.background ?? "",
              required: true,
            },
          ],
        };
      });

      setFormFields(newFields);
    } else {
      setFormFields([]); // Optional: Clear form if no valid data
    }
  } catch (e) {
    setSnackbar({
      open: true,
      message: "No Advt created.",
      severity: "error",
    });
  } finally {
    setLoading(false);
  }
};

  

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
      className="form2"
    >
      {loading ? (
        <CircularProgress />
      ) : (
        formFields.map((field) => (
          <React.Fragment key={field.id}>
            <FormFields
              label={field.label}
              btn={field.btn}
              handleAddClick={field.btn === "Add" ? handleAddField : undefined}
              handleRemoveClick={
                field.btn === "Remove"
                  ? () => handleRemoveField(field.id)
                  : undefined
              }
            />
            <Box className="form-group">
              {field.fields.map((nestedField) => (
                <FormFields
                  key={nestedField.id}
                  label={nestedField.label}
                  name={nestedField.name}
                  value={formData[nestedField.name] || nestedField.value || ""}
                  type={nestedField.type}
                  options={nestedField.options}
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
      />
    </Box>
  );
};

export default ADVT;
