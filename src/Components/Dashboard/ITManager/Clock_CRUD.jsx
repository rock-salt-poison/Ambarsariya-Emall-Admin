import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import FormFields from "../../Form/FormFields";
import CustomSnackbar from "../../CustomSnackbar";
import axios from "axios";
import symbol from "../../../API/currencySymbol.json";
import { get_countries, post_countries } from "../../../API/expressAPI";

function Clock_CRUD() {
  const open_weather_api_key = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
  const country_api_key = process.env.REACT_APP_COUNTRY_API_KEY;
  const timezone_db_api_key = process.env.REACT_APP_TIMEZONEDB_API_KEY;

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [countryNames, setCountryNames] = useState([]);

  const initialFormData = {
    country_name_1: "",
    country_code_1: "",
    capital_1: "",
    time_1: "",
    currency_1: "",
    country_name_2: "",
    country_code_2: "",
    capital_2: "",
    time_2: "",
    currency_2: "",
    country_name_3: "",
    country_code_3: "",
    capital_3: "",
    time_3: "",
    currency_3: "",
    country_name_4: "",
    country_code_4: "",
    capital_4: "",
    time_4: "",
    currency_4: "",
    country_name_5: "",
    country_code_5: "",
    capital_5: "",
    time_5: "",
    currency_5: "",
    country_name_6: "",
    country_code_6: "",
    capital_6: "",
    time_6: "",
    currency_6: "",
    currency_code_1: "",
    currency_code_2: "",
    currency_code_3: "",
    currency_code_4: "",
    currency_code_5: "",
    currency_code_6: "",
  };

  const fetchCountryNames = async () => {
    try {
      const res = await axios.get("https://flagcdn.com/en/codes.json");
      if (res) {
        const resp = Object.values(res.data);
        setCountryNames(resp);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Update formData state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Check if the changed field is a country_name field
    if (name.startsWith("country_name_")) {
      const countryIndex = name.split("_")[2]; // Extract the index from the field name (e.g., "country_name_1" -> "1")
      await fetchCountryDetails(value, countryIndex); // Fetch details based on the new country name
    }
  };

  const fetchCapitalTime = async (city) => {
    try {
      // Get the weather data from OpenWeatherMap API
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: city,
            appid: open_weather_api_key, // Ensure this key is defined
          },
        }
      );
  
      if (weatherResponse.data && weatherResponse.data.coord) {
        const { lat: latitude, lon: longitude } = weatherResponse.data.coord; // Extract lat & lon
        
        if (latitude && longitude) {
          try {
            const timezoneResponse = await axios.get(
              `https://api.timezonedb.com/v2.1/get-time-zone`,
              {
                params: {
                  key: timezone_db_api_key, // Ensure this key is defined
                  format: "json",
                  by: "position",
                  lat: latitude,
                  lng: longitude,
                },
              }
            );
  
            console.log("API Response:", timezoneResponse.data); // Log response
  
            if (timezoneResponse.data && timezoneResponse.data.zoneName) {
              return timezoneResponse.data.zoneName; // e.g., Asia/Kolkata
            }
          } catch (timezoneError) {
            console.error("Error fetching timezone data:", timezoneError);
            return "N/A";
          }
        }
      }
      return "N/A"; // If no timezone is found, return "N/A"
    } catch (weatherError) {
      console.error("Error fetching weather data:", weatherError);
      return "N/A"; // Return "N/A" in case of any error
    }
  };
  

  const fetchCountryDetails = async (countryName, index) => {
    try {
      const response = await axios.get(
        "https://api.api-ninjas.com/v1/country",
        {
          params: { name: countryName },
          headers: { "X-Api-Key": country_api_key },
        }
      );

      if (response.data && response.data.length > 0) {
        const countryData = response.data[0];
        const capitalTime = countryData.capital
          ? await fetchCapitalTime(countryData.capital)
          : "N/A";
        const currency_code = countryData.currency.code;

        const currency_symbol = currency_code
          ? symbol.find((item) => item.abbreviation === currency_code)
          : "";

        setFormData((prevData) => ({
          ...prevData,
          [`country_code_${index}`]: countryData.iso2 || "",
          [`capital_${index}`]: countryData.capital || "",
          [`time_${index}`]: capitalTime ? capitalTime : "",
          [`currency_code_${index}`]: `${currency_symbol?.symbol} ` || " ",
        }));
      }
    } catch (error) {
      console.error("Error fetching country details:", error);
    }
  };

  const fetch_countries_from_database = async () => {
    try {
      const res = await get_countries();
      if (res.message === "Valid") {
        const data = res.data;
        setFormData({
          country_name_1: data ? data[0].country_name : "",
          country_name_2: data ? data[1].country_name : "",
          country_name_3: data ? data[2].country_name : "",
          country_name_4: data ? data[3].country_name : "",
          country_name_5: data ? data[4].country_name : "",
          country_name_6: data ? data[5].country_name : "",
          country_code_1: data ? data[0].country_code : "",
          country_code_2: data ? data[1].country_code : "",
          country_code_3: data ? data[2].country_code : "",
          country_code_4: data ? data[3].country_code : "",
          country_code_5: data ? data[4].country_code : "",
          country_code_6: data ? data[5].country_code : "",
          capital_1: data ? data[0].country_capital : "",
          capital_2: data ? data[1].country_capital : "",
          capital_3: data ? data[2].country_capital : "",
          capital_4: data ? data[3].country_capital : "",
          capital_5: data ? data[4].country_capital : "",
          capital_6: data ? data[5].country_capital : "",
          currency_1: data ? data[0].currency : "",
          currency_2: data ? data[1].currency : "",
          currency_3: data ? data[2].currency : "",
          currency_4: data ? data[3].currency : "",
          currency_5: data ? data[4].currency : "",
          currency_6: data ? data[5].currency : "",
          currency_code_1: data ? data[0].currency_code : "",
          currency_code_2: data ? data[1].currency_code : "",
          currency_code_3: data ? data[2].currency_code : "",
          currency_code_4: data ? data[3].currency_code : "",
          currency_code_5: data ? data[4].currency_code : "",
          currency_code_6: data ? data[5].currency_code : "",
          time_1: data ? data[0].capital_time : "",
          time_2: data ? data[1].capital_time : "",
          time_3: data ? data[2].capital_time : "",
          time_4: data ? data[3].capital_time : "",
          time_5: data ? data[4].capital_time : "",
          time_6: data ? data[5].capital_time : "",
        });
      }
      console.log(res);
    } catch (e) {
      console.log(e);
    }
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
      try {
        const resp = await post_countries(formData);
        setSnackbar({
          open: true,
          message: resp
            ? "Details stored successfully."
            : "Failed to store details.",
          severity: resp ? "success" : "error",
        });
      } catch {
        setSnackbar({
          open: true,
          message: "Failed to store details.",
          severity: "error",
        });
      }
    }
  };

  useEffect(() => {
    setFormData(initialFormData);
    fetchCountryNames();
    fetch_countries_from_database();
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
          label: "Capital Time",
          name: "time_1",
          type: "text",
        },
        {
          id: 4,
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
          label: "Capital Time",
          name: "time_2",
          type: "text",
        },
        {
          id: 4,
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
          label: "Capital Time",
          name: "time_3",
          type: "text",
        },
        {
          id: 4,
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
          label: "Capital Time",
          name: "time_4",
          type: "text",
        },
        {
          id: 4,
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
          label: "Capital Time",
          name: "time_5",
          type: "text",
        },
        {
          id: 4,
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
          label: "Capital Time",
          value: "&#8366;",
          name: "time_6",
          type: "text",
        },
        {
          id: 4,
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
