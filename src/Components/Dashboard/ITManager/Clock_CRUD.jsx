import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import FormFields from "../../Form/FormFields";
import CustomSnackbar from "../../CustomSnackbar";
import axios from "axios";

function Clock_CRUD() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [countryNames, setCountryNames] =useState([]);

  const initialFormData = {
    country_name_1: "",
    capital_1: "",
    currency_1: "",
    country_name_2: "",
    capital_2: "",
    currency_2: "",
    country_name_3: "",
    capital_3: "",
    currency_3: "",
    country_name_4: "",
    capital_4: "",
    currency_4: "",
    country_name_5: "",
    capital_5: "",
    currency_5: "",
    country_name_6: "",
    capital_6: "",
    currency_6: "",
  };

  const fetchCountryNames =  async () => {
    try {
        const res = await axios.get('https://flagcdn.com/en/codes.json');
        if (res) {
            const resp = Object.values(res.data);
            setCountryNames(resp);
    }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {};

    Object.keys(formData).forEach((field) => {
      if (!formData[field] && !Array.isArray(formData[field])) {
        formErrors[field] = `${field} is required`;
      }
    });

    if (!formData["date"]) formErrors["date"] = "Date is required";
    if (!formData["time_from"])
      formErrors["time_from"] = "Time From is required";
    if (!formData["time_to"]) formErrors["time_to"] = "Time To is required";

    setErrors(formErrors);

    // try {
    //     const resp = await post_travel_time(data);
    //     setSnackbar({
    //         open: true,
    //         message: resp ? "Details stored successfully." : "Failed to store details.",
    //         severity: resp ? "success" : "error",
    //     });
    // } catch {
    //     setSnackbar({ open: true, message: "Failed to store details.", severity: "error" });
    // }
    // }
  };
  console.log(formData);

  useEffect(() => {
    setFormData(initialFormData);
    fetchCountryNames();
  }, []);

  const fields = [
    {
      id: 1,
      label: "Country 1",
      fields: [
        {
          id: 1,
          label: "Country Name",
          name: "country_name_1",
          type: "autocomplete",
          options: countryNames,
        },
        {
          id: 2,
          label: "Country Capital",
          name: "capital_1",
          type: "text",
        },
        {
          id: 3,
          label: "Currency Equivalent to Rs. 100",
          name: "currency_1",
          type: "text",
        },
      ],
    },
    {
      id: 2,
      label: "Country 2",
      fields: [
        {
          id: 1,
          label: "Country Name",
          name: "country_name_2",
          type: "autocomplete",
          options: countryNames,
        },
        {
          id: 2,
          label: "Country Capital",
          name: "capital_2",
          type: "text",
        },
        {
          id: 3,
          label: "Currency Equivalent to Rs. 100",
          name: "currency_2",
          type: "text",
        },
      ],
    },
    {
      id: 3,
      label: "Country 3",
      fields: [
        {
          id: 1,
          label: "Country Name",
          name: "country_name_3",
          type: "autocomplete",
          options: countryNames,
        },
        {
          id: 2,
          label: "Country Capital",
          name: "capital_3",
          type: "text",
        },
        {
          id: 3,
          label: "Currency Equivalent to Rs. 100",
          name: "currency_3",
          type: "text",
        },
      ],
    },
    {
      id: 4,
      label: "Country 4",
      fields: [
        {
          id: 1,
          label: "Country Name",
          name: "country_name_4",
          type: "autocomplete",
          options: countryNames,
        },
        {
          id: 2,
          label: "Country Capital",
          name: "capital_4",
          type: "text",
        },
        {
          id: 3,
          label: "Currency Equivalent to Rs. 100",
          name: "currency_4",
          type: "text",
        },
      ],
    },
    {
      id: 5,
      label: "Country 5",
      fields: [
        {
          id: 1,
          label: "Country Name",
          name: "country_name_5",
          type: "autocomplete",
          options: countryNames,
        },
        {
          id: 2,
          label: "Country Capital",
          name: "capital_5",
          type: "text",
        },
        {
          id: 3,
          label: "Currency Equivalent to Rs. 100",
          name: "currency_5",
          type: "text",
        },
      ],
    },
    {
      id: 6,
      label: "Country 6",
      fields: [
        {
          id: 1,
          label: "Country Name",
          name: "country_name_6",
          type: "autocomplete",
          options: countryNames,
        },
        {
          id: 2,
          label: "Country Capital",
          name: "capital_6",
          type: "text",
        },
        {
          id: 3,
          label: "Currency Equivalent to Rs. 100",
          name: "currency_6",
          type: "text",
        },
      ],
    },
  ];

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      className="form2"
    >
      {fields.map((field) => (
        <React.Fragment key={field.id}>
          <FormFields
            label={field.label}
            name={field.name}
            value={formData[field.name] || ""}
            type={field.type}
            options={field.options}
            error={!!errors[field.name]}
            onChange={handleChange}
            helperText={errors[field.name]}
            optionalCname={field.cName}
          />
          {field.fields && (
            <Box className="form-group">
              {field.fields.map((nestedField) => (
                <FormFields
                  key={nestedField.id}
                  label={nestedField.label}
                  name={nestedField.name}
                  value={formData[nestedField.name] || ""}
                  type={nestedField.type}
                  options={nestedField.options}
                  error={!!errors[nestedField.name]}
                  onChange={handleChange}
                  helperText={errors[nestedField.name]}
                />
              ))}
            </Box>
          )}
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

export default Clock_CRUD;
