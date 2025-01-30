import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import FormFields from "../../Form/FormFields";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../CustomSnackbar";
import { allShops, post_notice } from "../../../API/expressAPI"; // Import your API calls

const AmbarsariyaMallEventsForm = ({ page, title }) => {
  const initialFormData = {
    date_range: '',
    img: '',
    shop_name: '',
    community: '',
    message: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [shops, setShops] = useState([]);

  const navigate = useNavigate();

  const formFields = [
    {
        id: 1,
        label: "From-To",
        name: "date_range",
        type: "date-range",
        cName:'flex-auto',
        required:true
      },
      {
        id: 2,
        // label: "Image Link",
        name: "img",
        type: "file",
        cName:'flex-auto',
        required:true
      },
      {
        id: 3,
        label: "Shop",
        name: "shop_name",
        type: "select",
        options: shops,
        required:true,
        cName:'flex-auto',
      },
      {
        id: 4,
        label: "Community",
        name: "community",
        type: "text",
        cName:'flex-auto',
      },
      {
        id: 5,
        label: "Message",
        name: "message",
        type: "message",
        cName:'flex-auto',
        // required:true
      },
];

  useEffect(() => {
    
        const fetchShops = async () => {
          try {
            setLoading(true);
            const resp = await allShops();
            if (resp) {
              setShops(resp?.map((shop) => (shop.business_name))); // Extract shop names
            //   setShops([]); // Extract shop names
            }
          } catch (e) {
            console.error('Error fetching shops:', e);
          } finally {
            setLoading(false);
          }
        };
    
        fetchShops();

  }, [page]);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Reset errors
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
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

    // // Validate required fields
    // Object.entries(formData).forEach(([key, value]) => {
    //   if (!value && key !== "img") {
    //     formErrors[key] = `${key} is required`;
    //   }
    // });

    setErrors(formErrors);
    console.log(formErrors)
    if (Object.keys(formErrors).length === 0) {
      try {
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if (key === "date_range" && Array.isArray(value)) {
            data.append("from_date", new Date(value[0]).toLocaleDateString("en-CA"));
            data.append("to_date", new Date(value[1]).toLocaleDateString("en-CA"));
          } else {
            data.append(key, value);
          }
        });

        data.append("title", title);
        // Call the API to post the notice
        const resp = await post_notice(data);
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
        setSnackbar({
          open: true,
          message: "Failed to store details.",
          severity: "error",
        });
      }
    }
  };

  return (
    <Box component="form" autoComplete="off" onSubmit={handleSubmit} className="form2">
      {loading ? (
        <CircularProgress />
      ) : (
        formFields && formFields?.map((field) => (
            <FormFields
            key={field.id}
              label={field.label}
              name={field.name}
              value={field.type !== "file" ? formData[field.name] || "" : undefined}          
              type={field.type}
              options={field.options} // Only pass shops options to the shop_name field
              error={!!errors[field.name]}
              onChange={field.type === "file" ? handleFileChange : handleChange}
              helperText={errors[field.name]}
              optionalCname={field.cName}
              required={field.required}
            />
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

    // <></>
  );
};

export default AmbarsariyaMallEventsForm;
