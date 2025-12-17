import React, { useEffect, useState, useMemo, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import GoogleMapsLoader from "../Maps/GoogleMapsLoader";

export default function AddressGoogleMapField({
  value,
  label,
  onChange,
  cName,
  required,
  readOnly,
  multiple = false, // new prop for single/multiple
}) {
  const [inputValue, setInputValue] = useState("");
  const [updatedValue, setUpdatedValue] = useState(multiple ? [] : null);
  const [options, setOptions] = useState([]);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);

  // Initialize Google Maps services
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      if (!autocompleteServiceRef.current) {
        autocompleteServiceRef.current =
          new window.google.maps.places.AutocompleteService();
      }
      if (!placesServiceRef.current) {
        placesServiceRef.current = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );
      }
    } else {
      console.error("Google Maps API not loaded properly");
    }
  }, []);

  const fetchPredictions = useMemo(
    () =>
      debounce((request, callback) => {
        if (autocompleteServiceRef.current) {
          autocompleteServiceRef.current.getPlacePredictions(request, callback);
        }
      }, 400),
    []
  );

  useEffect(() => {
    let active = true;

    if (!inputValue) {
      setOptions(
        multiple
          ? updatedValue.length
            ? [...updatedValue]
            : []
          : updatedValue
          ? [updatedValue]
          : []
      );
      return;
    }

    if (autocompleteServiceRef.current) {
      fetchPredictions({ input: inputValue }, (results) => {
        if (active) {
          setOptions(
            multiple
              ? updatedValue.length
                ? [...updatedValue, ...(results || [])]
                : results || []
              : updatedValue
              ? [updatedValue, ...(results || [])]
              : results || []
          );
        }
      });
    }

    return () => {
      active = false;
    };
  }, [inputValue, fetchPredictions, updatedValue, multiple]);

  useEffect(() => {
    if (value !== undefined) {
      setUpdatedValue(multiple ? (Array.isArray(value) ? value : []) : value);
      if (!multiple && value?.description) setInputValue(value.description);
    }
  }, [value, multiple]);

  const handlePlaceSelect = (event, newValue) => {
    if (multiple) {
      if (!newValue || newValue.length === 0) {
        setUpdatedValue([]);
        onChange([]);
        return;
      }

      const updatedPlaces = [];

      newValue.forEach((val) => {
        if (val.place_id && val.place_id !== "manual_entry") {
          placesServiceRef.current.getDetails({ placeId: val.place_id }, (placeDetails, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const placeData = {
                description: val.description,
                place_id: val.place_id,
                latitude: placeDetails.geometry?.location?.lat() ?? 31.6340,
                longitude: placeDetails.geometry?.location?.lng() ?? 74.8723,
                formatted_address: placeDetails.formatted_address || val.description,
              };

              setUpdatedValue((prev) => {
                const others = prev.filter(p => p.place_id !== placeData.place_id);
                const combined = [...others, placeData];
                onChange(combined);
                return combined;
              });
            }
          });
        } else {
          // manual entry
          updatedPlaces.push({
            description: val.description,
            place_id: "manual_entry",
            latitude: 31.6340,
            longitude: 74.8723,
            formatted_address: val.description,
          });
        }
      });

      if (updatedPlaces.length) {
        setUpdatedValue((prev) => {
          const combined = [...prev.filter(p => p.place_id !== "manual_entry"), ...updatedPlaces];
          onChange(combined);
          return combined;
        });
      }
    } else {
      if (!newValue) {
        setUpdatedValue(null);
        onChange(null);
        return;
      }

      if (newValue.place_id && newValue.place_id !== "manual_entry") {
        placesServiceRef.current.getDetails({ placeId: newValue.place_id }, (placeDetails, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const placeData = {
              description: newValue.description,
              place_id: newValue.place_id,
              latitude: placeDetails.geometry?.location?.lat() ?? 31.6340,
              longitude: placeDetails.geometry?.location?.lng() ?? 74.8723,
              formatted_address: placeDetails.formatted_address || newValue.description,
            };
            setUpdatedValue(placeData);
            onChange(placeData);
          }
        });
      } else {
        saveUserTypedLocation();
      }
    }
  };

  const saveUserTypedLocation = () => {
    if (!inputValue.trim()) return;

    const manualPlace = {
      description: inputValue,
      place_id: "manual_entry",
      latitude: 31.6340,
      longitude: 74.8723,
      formatted_address: inputValue,
    };

    if (multiple) {
      setUpdatedValue((prev) => {
        const combined = [...prev.filter(p => p.place_id !== "manual_entry"), manualPlace];
        onChange(combined);
        return combined;
      });
    } else {
      setUpdatedValue(manualPlace);
      onChange(manualPlace);
    }
  };

  return (
    <GoogleMapsLoader>
      <Autocomplete
        multiple={multiple}
        getOptionLabel={(option) => (typeof option === "string" ? option : option.description)}
        filterOptions={(x) => x}
        options={options}
        autoComplete
        required={required}
        includeInputInList
        filterSelectedOptions
        value={updatedValue}
        size="small"
        noOptionsText="No locations"
        className={cName}
        readOnly={readOnly}
        isOptionEqualToValue={(option, value) => option?.description === value?.description}
        onChange={handlePlaceSelect}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        onBlur={saveUserTypedLocation}
        renderInput={(params) => (
          <TextField {...params} label={label} fullWidth className="input_field address" />
        )}
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
