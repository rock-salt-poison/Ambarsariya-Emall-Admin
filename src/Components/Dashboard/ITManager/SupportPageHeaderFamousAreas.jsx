import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import FormFields from "../../Form/FormFields";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";
import {
  delete_led_board_message,
  post_led_board_message,
} from "../../../API/expressAPI";
import MapWithMarker from "../../Maps/MapWithMarker";

function SupportPageHeaderFamousAreas({ page, fieldsData, title }) {
  const [category, setCategory] = useState(fieldsData[0]);
  const [formData, setFormData] = useState({});
  const [dynamicFields, setDynamicFields] = useState(fieldsData[page] || []);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fields = fieldsData[category] || [];

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
  useEffect(() => {
    if (page) {
      setCategory(page);
      setFormData(generateInitialData(fieldsData[page]));
    }
  }, [page, fieldsData]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      // If field is area, extract and store lat/lng separately
      if (name.startsWith("area_") && value?.latitude && value?.longitude) {
        updatedFormData[`lat_${name}`] = value.latitude;
        updatedFormData[`lng_${name}`] = value.longitude;
      }
      console.log(updatedFormData);

      return updatedFormData;
    });
  };

  // Handle adding a new field group
  const handleAddField = () => {
    const groupNumber =
      dynamicFields.length > 0
        ? Math.max(...dynamicFields.map((field) => field.groupNumber || 0)) + 1
        : 1;

    const newFields = [
      {
        id: groupNumber,
        label: `Area ${groupNumber}`,
        groupNumber,
        btn: "remove",
      },
      {
        id: groupNumber + 1,
        label: "Enter a famous area",
        name: `area_${groupNumber}`,
        type: "address",
        required: true,
        groupNumber,
      },
      {
        id: groupNumber + 2,
        label: "Enter Length (km)",
        name: `length_${groupNumber}`,
        type: "number",
        required: true,
        groupNumber,
      },
      {
        id: groupNumber + 3,
        label: "Enter area name",
        name: `areaname_${groupNumber}`,
        type: "text",
        required: true,
        groupNumber,
      },
      {
        id: groupNumber + 4,
        type: "map",
        name: `map_${groupNumber}`,
        groupNumber,
      },
      {
        id: groupNumber + 5,
        label: "Shop number (optional)",
        name: `shop_no_${groupNumber}`,
        type: "text",
        groupNumber,
      },
      {
        id: groupNumber + 6,
        name: `bg_img_${groupNumber}`,
        type: "file",
        required: true,
        groupNumber,
      },
    ];

    setDynamicFields((prev) => [...prev, ...newFields]);
    setFormData((prev) => ({
      ...prev,
      [`area_${groupNumber}`]: "",
      [`lat_area_${groupNumber}`]: "",
      [`lng_area_${groupNumber}`]: "",
    }));
  };

  // Handle removing a field group
  const handleRemoveField = (groupNumber) => {
    setDynamicFields((prev) =>
      prev.filter((field) => field.groupNumber !== groupNumber)
    );

    setFormData((prev) => {
      const updatedFormData = { ...prev };
      Object.keys(updatedFormData).forEach((key) => {
        if (key.includes(`_${groupNumber}`)) {
          delete updatedFormData[key];
        }
      });
      return updatedFormData;
    });

    console.log(`Group ${groupNumber} removed successfully.`);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        formErrors[key] = `${key} is required`;
      }
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const messages = dynamicFields
          .filter((field) => field.name)
          .map((field) => ({
            id: field.name.split("_")[1] || null,
            text: formData[field.name],
          }));

        const resp = await post_led_board_message({ messages });

        setSnackbar({
          open: true,
          message: resp
            ? "Details stored successfully."
            : "Failed to store details.",
          severity: resp ? "success" : "error",
        });
      } catch (e) {
        console.error("Error submitting:", e);
        setSnackbar({
          open: true,
          message: "Failed to store message.",
          severity: "error",
        });
      }
    }
  };
  console.log(formData);

  return (
    <Box
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit}
      className="form2"
    >
      {dynamicFields?.map((field, index) => {
  if (field.type === "map") {
    const areaIndex = field.name.split("_")[1]; // Extracting number from `map_1`
    return (
      <MapWithMarker
        key={index}
        latitude={Number(formData[`lat_area_${areaIndex}`]) || 31.6331}
        longitude={Number(formData[`lng_area_${areaIndex}`]) || 74.8656}
        length={Number(formData[`length_${areaIndex}`]) || 0}
      />
    );
  } else {
    return (
      <FormFields
        key={index}
        label={field.label}
        name={field.name}
        value={formData[field.name] || ""}
        type={field.type}
        error={!!errors[field.name]}
        onChange={handleChange}
        helperText={errors[field.name]}
        required={field.required}
        btn={field.btn}
        handleAddClick={handleAddField}
        handleRemoveClick={() => handleRemoveField(field.groupNumber)}
      />
    );
  }
})}

      {fields.length > 0 && (
        <Box sx={{ width: "100%" }}>
          <Button type="submit" variant="contained" className="btn_submit">
            Save
          </Button>
        </Box>
      )}{" "}
      <CustomSnackbar {...snackbar} />
    </Box>
  );
}

export default SupportPageHeaderFamousAreas;
