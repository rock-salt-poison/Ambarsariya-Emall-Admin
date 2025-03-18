import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import FormFields from "../../Form/FormFields";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";
import {
  delete_support_page_famous_areas,
  get_support_page_famous_areas,
  post_support_page_famous_areas,
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
      fetch_areas_from_database();
    }
  }, [page, fieldsData]);


  const fetch_areas_from_database = async () => {
    try {
      const resp = await get_support_page_famous_areas(); // Fetch data from API
  
      console.log(resp);
      
      if (resp && resp.length > 0) {
        const newFields = [];
        const newFormData = {};
  
        resp.forEach((area, index) => {
          const groupNumber = index + 1; // Unique group number
          
          newFields.push(
            {
              id: groupNumber,
              label: `Area ${groupNumber}`, // Label for area
              btn: groupNumber === 1 ? "Add" : "remove", // "Add" for first, "Remove" for others
              groupNumber
            },
            {
              id: groupNumber + 1,
              label: "Enter a famous area or market",
              name: `area_${groupNumber}`,
              type: "address",
              cName: "flex-auto",
              required: true,
              groupNumber,
            },
            {
              id: groupNumber + 2,
              label: "Enter Length (km)",
              name: `length_${groupNumber}`,
              type: "number",
              cName: "flex-auto",
              required: true,
              groupNumber,
            },
            {
              id: groupNumber + 3,
              label: "Enter area name",
              name: `areaname_${groupNumber}`,
              type: "text",
              cName: "flex-auto",
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
              cName: "flex-auto",
              type: "text",
              groupNumber,
            },
            {
              id: groupNumber + 6,
              name: `bg_img_${groupNumber}`,
              type: "file",
              required: true,
              cName: "flex-auto",
              groupNumber,
            }
          );
          // Populate form data with fetched values
          newFormData[`area_${groupNumber}`] = area.area_address || "";
          newFormData[`lat_area_${groupNumber}`] = area.latitude || "";
          newFormData[`lng_area_${groupNumber}`] = area.longitude || "";
          newFormData[`length_${groupNumber}`] = Number(area.length_in_km) || "";
          newFormData[`areaname_${groupNumber}`] = area.area_title || "";
          newFormData[`shop_no_${groupNumber}`] = area.shop_no || "";
          newFormData[`bg_img_${groupNumber}`] = area.image_src || "";
        });
  
        // Update state with fetched data
        setDynamicFields(newFields);
        setFormData(newFormData);
      } else {
        // If no data, reset fields
        setDynamicFields(fieldsData[page] || []);
        setFormData({});
      }
    } catch (e) {
      console.error("Error fetching areas:", e);
    }
  };
  
console.log(formData);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
  
    setFormData((prev) => {
      let updatedFormData = { ...prev };
      
      if (type === "file") {
        if (files.length > 0) {
          console.log(`File uploaded for field: ${name}`);
          
          updatedFormData[name] = files[0]; // Correctly store the file object
        }
      } else {
        updatedFormData[name] = value;
  
        // If field is area, extract and store lat/lng separately
        if (name.startsWith("area_") && value && value.latitude && value.longitude) {
          updatedFormData[`lat_${name}`] = value.latitude;
          updatedFormData[`lng_${name}`] = value.longitude;
        }
      }
  
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
        label: "Enter a famous area or market",
        name: `area_${groupNumber}`,
        type: "address",
        cName: "flex-auto",
        required: true,
        groupNumber,
      },
      {
        id: groupNumber + 2,
        label: "Enter Length (km)",
        name: `length_${groupNumber}`,
        type: "number",
        cName: "flex-auto",
        required: true,
        groupNumber,
      },
      {
        id: groupNumber + 3,
        label: "Enter area name",
        name: `areaname_${groupNumber}`,
        type: "text",
        cName: "flex-auto",
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
        cName: "flex-auto",
        type: "text",
        groupNumber,
      },
      {
        id: groupNumber + 6,
        name: `bg_img_${groupNumber}`,
        type: "file",
        required: true,
        cName: "flex-auto",
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

  const handleRemoveField = (groupNumber) => {
    console.log(groupNumber);
    
    if (!groupNumber) return;
  
    deleteAreaFromDatabase(groupNumber);
  
    // Remove all fields associated with the groupNumber
    setDynamicFields((prev) => prev.filter((field) => field.groupNumber !== groupNumber));
  
    // Remove corresponding form data
    setFormData((prev) => {
      const updatedFormData = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (key.endsWith(`_${groupNumber}`) || key === `area_${groupNumber}`) {
          delete updatedFormData[key];
        }
      });
      return updatedFormData;
    });
  
    console.log(`Group ${groupNumber} removed successfully.`);
  };
  

  const deleteAreaFromDatabase = async (groupNumber) => {
    try {
        const areaData = {
            area_name: formData[`areaname_${groupNumber}`],
            area_address: formData[`area_${groupNumber}`],
            latitude: formData[`lat_area_${groupNumber}`],
            longitude: formData[`lng_area_${groupNumber}`],
        };

        // Check if all values in areaData are non-empty
        if (Object.values(areaData).some(value => !value)) {
            console.warn(`Skipping delete: Area ${groupNumber} has empty values.`);
            return;
        }

        console.log("Deleting area with data:", areaData);
        await delete_support_page_famous_areas(areaData);

        console.log(`Area ${groupNumber} deleted from database.`);
        setSnackbar({
            open: true,
            message: "Deleted Successfully.",
            severity: "success",
        });
    } catch (error) {
        console.error(`Error deleting area ${groupNumber}:`, error);
        setSnackbar({
            open: true,
            message: "Error deleting area.",
            severity: "error",
        });
    }
};

  
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};

    if (Object.keys(formErrors).length === 0) {
      try {
        const areas = Object.keys(formData)
          .filter((key) => key.startsWith("area_"))
          .map((key) => {
            const areaIndex = key.split("_")[1];
            return {
              id: areaIndex || null,
              area_address: formData[`area_${areaIndex}`]?.description || formData[`area_${areaIndex}`] || null,
              latitude: formData[`lat_area_${areaIndex}`] || "",
              longitude: formData[`lng_area_${areaIndex}`] || "",
              length: formData[`length_${areaIndex}`] || "",
              area_name: formData[`areaname_${areaIndex}`] || "",
              shop_no: formData[`shop_no_${areaIndex}`] || null,
              bg_img: formData[`bg_img_${areaIndex}`] || "",
            };
          });

          console.log('areas', areas);
        const resp = await post_support_page_famous_areas({ areas });
        

        setSnackbar({
          open: true,
          message: resp
            ? "Details stored successfully."
            : "Failed to store details.",
          severity: resp ? "success" : "error",
        });
      } catch (e) {
        console.error("Error submitting:", e);
        if(e.response.data.error==="File too large"){
          setSnackbar({
            open: true,
            message: "File size should not exceed the 1MB limit.",
            severity: "error",
          });
        }else{
          setSnackbar({
            open: true,
            message: "Failed to store area(s).",
            severity: "error",
          });
        }
      }
    }
  };

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
              value={field.type !== "file" ? formData[field.name] || "" : undefined}
              file={field.type === "file" ? formData[field.name] || null : undefined} 
              type={field.type}
              error={!!errors[field.name]}
              onChange={handleChange}
              helperText={errors[field.name]}
              optionalCname={field.cName}
              required={field.required}
              btn={field.btn}
              handleAddClick={handleAddField}
              handleRemoveClick={() => handleRemoveField(field.groupNumber)}
              uploadedFile={formData[`bg_img_${field.groupNumber}`]}
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
