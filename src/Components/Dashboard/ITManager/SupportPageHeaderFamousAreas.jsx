import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import FormFields from "../../Form/FormFields";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";
import {
  delete_led_board_message,
  get_led_board_message,
  post_led_board_message,
  post_notice,
} from "../../../API/expressAPI";

function SupportPageHeaderFamousAreas({ page, fieldsData, title }) {
  const [category, setCategory] = useState(fieldsData[0]); // Default category
  const [formData, setFormData] = useState({});
  const [dynamicFields, setDynamicFields] = useState(fieldsData[page]);
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
      if (field.name) {
        data[field.name] = field.value || ""; // Only add fields with a 'name' to formData
      }
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

  const handleAddField = () => {
    const groupNumber =
    dynamicFields.length > 0
      ? Math.max(...dynamicFields.map((field) => field.groupNumber || 0)) + 1
      : 1;

  console.log("New groupNumber:", groupNumber);
    
    const newFields = [
      {
        id: groupNumber,
        label: `Area ${groupNumber}`,
        groupNumber,
        btn: "remove",
      },
      {
        id: groupNumber + 1,
        label: "Enter a famous area or market",
        name: `area_${groupNumber}`,
        type: "address",
        required: true,
        groupNumber,
      },
      {
        id: groupNumber + 2,
        label: "Radius To (in km)",
        name: `radius_to_${groupNumber}`,
        type: "number",
        required: true,
        groupNumber,
      },
      {
        id: groupNumber + 3,
        label: "Radius From (in km)",
        name: `radius_from_${groupNumber}`,
        type: "number",
        required: true,
        groupNumber,
      },
      {
        id: groupNumber + 4,
        label: "Enter name of the area",
        name: `area_name_${groupNumber}`,
        type: "text",
        required: true,
        groupNumber,
      },
      {
        id: groupNumber + 5,
        name: `bg_img_${groupNumber}`,
        type: "file",
        required: true,
        groupNumber,
      },
    ];

    setDynamicFields((prevFields) => [...prevFields, ...newFields]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [`area_${groupNumber}`]: "",
    }));
  };

  const handleRemoveField = (groupNumber) => {
    // Filter out all fields belonging to the group
    const fieldsToRemove = dynamicFields.filter(
      (field) => field.groupNumber === groupNumber
    );
  
    // Update state by removing the group fields
    setDynamicFields((prevFields) =>
      prevFields.filter((field) => field.groupNumber !== groupNumber)
    );
  
    // Remove related form data
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData };
      fieldsToRemove.forEach((field) => {
        if (field.name) {
          delete updatedFormData[field.name];
        }
      });
      return updatedFormData;
    });
  
    // Call delete API for each field with a database ID
    fieldsToRemove.forEach((field) => {
      if (field.name && field.name.includes("_")) {
        const id = field.name.split("_")[1]; // Extract the ID
        handleDelete(id);
      }
    });
  
    console.log(`Group ${groupNumber} removed successfully.`);
  };
  

  const handleDelete = async (id) => {
    try {
      const resp = await delete_led_board_message(id);
      if (resp) {
        setSnackbar({
          open: true,
          message: "Deleted Successfully.",
          severity: "success",
        });
      }
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Failed to delete message.",
        severity: "error",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};

    // Validate required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        formErrors[key] = `${key} is required`;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const messages = dynamicFields
          .filter((field) => field.name) // Only include input fields
          .map((field) => ({
            id: `${field.name.split("_")[1]}` || null,
            text: formData[field.name],
          }));

        // Call the API
        const resp = await post_led_board_message({ messages });

        // Show success message
        setSnackbar({
          open: true,
          message: resp
            ? "Details stored successfully."
            : "Failed to store details.",
          severity: resp ? "success" : "error",
        });
      } catch (e) {
        console.error("Error during message submission:", e);
        setSnackbar({
          open: true,
          message: "Failed to store message.",
          severity: "error",
        });
      }
    }
  };

  // Initialize the form data based on the selected category
  useEffect(() => {
    handleCategoryChange(page);
    fetch_message_from_database();
  }, [page]);

  const fetch_message_from_database = async () => {
    try {
      let resp; // Fetch data from the API

      if (resp && resp.length > 0) {
        // If the response has messages, populate the dynamicFields and formData
        const newFields = [];
        const newFormData = {};

        resp.forEach((message, index) => {
          const messageNumber = index + 1; // Create dynamic message numbers

          newFields.push(
            {
              id: messageNumber * 2 - 1,
              label: `Message ${messageNumber}`, // Label for the message
              btn: messageNumber === 1 ? "Add" : "remove", // First field gets "add", others get "remove"
            },
            {
              id: messageNumber * 2,
              label: "Message",
              name: `message_${messageNumber}`, // Field name for the input
              type: "text",
            }
          );

          newFormData[`message_${messageNumber}`] = message.message; // Populate formData with message content
        });

        // Update state with fetched messages
        setDynamicFields(newFields);
        setFormData(newFormData);
      } else {
        // If no messages exist, reset to default field with an "Add" button
        setDynamicFields(fieldsData[page]);
        setFormData({ message_1: "" });
      }
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  };

  const fields = fieldsData[category] || [];
  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
      className="form2"
    >
      {dynamicFields.map((field, index) => (
        <React.Fragment key={index}>
          <FormFields
            label={field.label}
            name={field.name}
            value={formData[field.name] || ""} // Bind value for fields
            type={field.type}
            options={field.options}
            error={!!errors[field.name]}
            onChange={handleChange} // Handle file or text changes
            helperText={errors[field.name]}
            optionalCname={field.cName}
            required={field.required}
            btn={field.btn}
            handleAddClick={handleAddField}
            handleRemoveClick={() => handleRemoveField(field.groupNumber)} // Pass field name for removal
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

export default SupportPageHeaderFamousAreas;
