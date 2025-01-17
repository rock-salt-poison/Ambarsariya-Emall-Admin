import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import FormFields from "../../Form/FormFields";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";
import { get_led_board_message, post_notice } from "../../../API/expressAPI";
import { noticeFieldData } from "../../../noticeFieldData"; // Import your fields data

function LEDBoard({ page, fieldsData, title }) {
  const [category, setCategory] = useState(fieldsData[0]); // Default category
  const [formData, setFormData] = useState({});
  const [dynamicFields, setDynamicFields] = useState(noticeFieldData.LED_board_display);
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
    const lastField = dynamicFields[dynamicFields.length - 1];
    const newMessageNumber = dynamicFields.filter((field) => field.name?.startsWith("message_")).length + 1;

    const newFields = [
      {
        id: (lastField?.id || 0) + 1,
        label: `Message ${newMessageNumber}`,
        btn: "remove",
      },
      {
        id: (lastField?.id || 0) + 2,
        label: "Message",
        name: `message_${newMessageNumber}`,
        type: "text",
      },
    ];

    setDynamicFields((prevFields) => [...prevFields, ...newFields]);

    setFormData((prevFormData) => ({
      ...prevFormData,
      [`message_${newMessageNumber}`]: "",
    }));
  };

  const handleRemoveField = (labelValue) => {
    const fieldIndex = dynamicFields.findIndex((field) => field.label === labelValue);

    if (fieldIndex !== -1) {
      const textField = dynamicFields[fieldIndex + 1];

      const updatedFields = dynamicFields.filter(
        (field, index) => index !== fieldIndex && index !== fieldIndex + 1
      );

      setDynamicFields(updatedFields);

      if (textField?.name) {
        setFormData((prevFormData) => {
          const updatedFormData = { ...prevFormData };
          delete updatedFormData[textField.name];
          return updatedFormData;
        });
      }
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
      // try {
      //   const data = new FormData();

      //   Object.entries(formData).forEach(([key, value]) => {
      //     if (key === "date_range" && Array.isArray(value)) {
      //       data.append("from_date", new Date(value[0]).toLocaleDateString("en-CA"));
      //       data.append("to_date", new Date(value[1]).toLocaleDateString("en-CA"));
      //     } else {
      //       data.append(key, value);
      //     }
      //   });

      //   data.append("title", title);

      //   // Call the API
      //   const resp = await post_notice(data);

      //   // Show success message
      //   setSnackbar({
      //     open: true,
      //     message: resp ? "Details stored successfully." : "Failed to store details.",
      //     severity: resp ? "success" : "error",
      //   });
      // } catch (e) {
      //   console.error("Error during notice submission:", e);
      //   setSnackbar({
      //     open: true,
      //     message: "Failed to store details.",
      //     severity: "error",
      //   });
      // }
    }
  };

  // Initialize the form data based on the selected category
  useEffect(() => {
    handleCategoryChange(page);
    fetch_message_from_database();
  }, [page]);

  const fetch_message_from_database = async () => {
    try {
      const resp = await get_led_board_message(); // Fetch data from the API
      console.log(resp);
  
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
        setDynamicFields([
          {
            id: 1,
            label: "Message 1",
            btn: "add", // First field starts with "add"
          },
          {
            id: 2,
            label: "Message",
            name: "message_1",
            type: "text",
          },
        ]);
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
      {dynamicFields.map((field) => (
        <React.Fragment key={field.id}>
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
            handleRemoveClick={() => handleRemoveField(field.label)} // Pass field name for removal
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

export default LEDBoard;
