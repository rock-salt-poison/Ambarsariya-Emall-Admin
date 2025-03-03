import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import GoogleMapsLoader from "../Maps/GoogleMapsLoader"; // Ensure correct import

export default function AddressGoogleMapField({ value, label, onChange, cName, required }) {
  const [inputValue, setInputValue] = useState("");
  const [updatedValue, setUpdatedValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);

  // Initialize Google Maps services
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      if (!autocompleteService) {
        setAutocompleteService(new window.google.maps.places.AutocompleteService());
      }
      if (!placesService) {
        setPlacesService(new window.google.maps.places.PlacesService(document.createElement("div")));
      }
    } else {
      console.error("Google Maps API not loaded properly");
    }
  }, []);
  

  // Debounced fetch predictions function
  const fetchPredictions = useMemo(
    () =>
      debounce((request, callback) => {
        if (autocompleteService) {
          autocompleteService.getPlacePredictions(request, callback);
        }
      }, 400),
    [autocompleteService]
  );

  useEffect(() => {
    let active = true;

    if (!inputValue) {
      setOptions(updatedValue ? [updatedValue] : []);
      return;
    }

    if (autocompleteService) {
      fetchPredictions({ input: inputValue }, (results) => {
        if (active) {
          setOptions(updatedValue ? [updatedValue, ...(results || [])] : results || []);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [inputValue, fetchPredictions, autocompleteService]);

  useEffect(() => {
    if (value) {
      setUpdatedValue(value);
      setInputValue(value.description || value);
    }
  }, [value]);

  const handlePlaceSelect = (event, newValue) => {
    if (!newValue) {
      // Handle clearing the value
      setUpdatedValue(null);
      onChange(null);
      return;
    }
    if (newValue && newValue.place_id !== "no_match") {
      if (!placesService.current && window.google) {
        placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
      }

      placesService.current.getDetails(
        { placeId: newValue.place_id },
        (placeDetails, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const placeData = {
              description: newValue.description,
              place_id: newValue.place_id,
              latitude: placeDetails.geometry?.location?.lat() || 31.6340, // Default Amritsar
              longitude: placeDetails.geometry?.location?.lng() || 74.8723, // Default Amritsar
              formatted_address: placeDetails.formatted_address || newValue.description,
            };

            onChange(placeData);
            setUpdatedValue(placeData);
          }
        }
      );
    } else {
      saveUserTypedLocation();
    }
  };

  // Saves the user-typed input if no option is selected
  const saveUserTypedLocation = () => {
    if (!inputValue.trim() || (updatedValue && updatedValue.place_id !== "manual_entry")) return;
  
    const defaultPlace = {
      description: inputValue, 
      place_id: "manual_entry",
      latitude: 31.6340, 
      longitude: 74.8723,
      formatted_address: inputValue, 
    };
  
    onChange(defaultPlace);
    setUpdatedValue(defaultPlace);
  };

  return (
    <GoogleMapsLoader>
      <Autocomplete
        getOptionLabel={(option) => (typeof option === "string" ? option : option.description)}
        filterOptions={(x) => x}
        options={options}
        autoComplete
        required
        includeInputInList
        filterSelectedOptions
        value={updatedValue}
        size="small"
        noOptionsText="No locations"
        className={cName}
        isOptionEqualToValue={(option, value) => option?.description === value?.description}
        onChange={handlePlaceSelect}
        onInputChange={(event, newInputValue) => {setInputValue(newInputValue) ;
          if (!newInputValue.trim()) {
          setUpdatedValue(null);
          onChange(null);
        }}}
        onBlur={saveUserTypedLocation} // Handle case when user leaves input without selection

        renderInput={(params) => <TextField {...params} label={label} fullWidth className="input_field address" />}
        renderOption={(props, option) => {
          const matches = option.structured_formatting?.main_text_matched_substrings || [];
          const parts = parse(
            option.structured_formatting?.main_text || "",
            matches.map((match) => [match.offset, match.offset + match.length])
          );

          return (
            <li {...props}>
              <Grid container sx={{ alignItems: "center" }}>
                <Grid item sx={{ display: "flex", width: 44 }}>
                  <LocationOnIcon sx={{ color: "text.secondary" }} />
                </Grid>
                <Grid item sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}>
                  {parts.map((part, index) => (
                    <Box key={index} component="span" sx={{ fontWeight: part.highlight ? "bold" : "regular" }}>
                      {part.text}
                    </Box>
                  ))}
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {option.structured_formatting?.secondary_text}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    </GoogleMapsLoader>
  );
}
