import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers";
import DateRangePicker from 'rsuite/esm/DateRangePicker';
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import ReactQuill from 'react-quill'; // Import ReactQuill for the message2 field
import 'react-quill/dist/quill.snow.css';
import Address_Google_Map_Field from "./Address_Google_Map_Field";
import MapWithMarker from "../Maps/MapWithMarker";

export default function FormFields({
  label,
  name,
  value,
  btn,
  onChange,
  placeholder,
  error,
  width = true,
  helperText,
  type, // Can be 'text', 'password', 'select', 'date', 'time', or 'autocomplete'
  options, // For select/autocomplete field options
  handleAddClick,
  handleRemoveClick,
  optionalCname,
  required,
  file,
  uploadedFile,
  multiple, readOnly,
  disable
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { beforeToday } = DateRangePicker;

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleOpenAutocomplete = () => {
    setOpen(true);
    if (!options.length) {
      setLoading(true);
      // Simulate async data loading
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleCloseAutocomplete = () => {
    setOpen(false);
  };

  const [timeValue, setTimeValue] = useState(
    value ? dayjs(value, "HH:mm:ss") : null
  );

  useEffect(() => {
    if (value) {
      if (type === "time") {
        setTimeValue(dayjs(value, "HH:mm:ss")); // Parse time format correctly
      } else if (type === "date") {
        setTimeValue(dayjs(value));
      }
    }
  }, [value, type]);

  const handleSelectChange = (e) => {
    const { value } = e.target;
    onChange({
      target: {
        name,
        value
      }
    });
  };

  const formatIndianMobile = (val = "") => {
    // Remove everything except digits
    let digits = val.replace(/\D/g, "");

    // Remove leading 91 if pasted
    if (digits.startsWith("91")) {
      digits = digits.slice(2);
    }

    // Limit to 10 digits
    digits = digits.slice(0, 10);

    if (digits.length > 5) {
      return `+91 ${digits.slice(0, 5)}-${digits.slice(5)}`;
    }

    return `+91 ${digits}`;
  };


  return (
    <>
      {type === "select" ? (
        <FormControl variant="outlined" fullWidth={width} size="small" className={optionalCname}>
          <InputLabel>{label}</InputLabel>
          <Select
            name={name}
            value={value || ''}
            onChange={(e) => handleSelectChange(e)}
            label={label}
            required={required}
            readOnly={readOnly}
          >

            {disable ? options?.map((option, index) => (
              <MenuItem key={index + 1} value={option} disabled={disable}>
                {option}
              </MenuItem>
            )) : options?.map((option, index) => (
              <MenuItem key={index + 1} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : type === "password" ? (
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel htmlFor="outlined-adornment-password" size="small">
            {label}
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={value}
            name={name}
            onChange={onChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOff fontSize="small" />
                  ) : (
                    <Visibility fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            }
            label={label}
            autoComplete="new-password"
            size="small"
            readOnly={readOnly}
          />
        </FormControl>
      ) : type === "date" ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            name={name}
            sx={{
              [`& .MuiInputBase-input`]: {
                padding: "8px 14px",
              },
              ["& .MuiFormLabel-root"]: { top: "-8px" },
            }}
            className={optionalCname}
            readOnly={readOnly}
            value={timeValue}
            onChange={(newValue) => {
              setTimeValue(newValue);
              onChange({ target: { name, value: newValue?.toISOString() } });
            }}
          />
        </LocalizationProvider>
      ) : type === "time" ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label={label}
            name={name}
            sx={{
              [`& .MuiInputBase-input`]: {
                padding: "8px 14px",
              },
              ["& .MuiFormLabel-root"]: { top: "-8px" },
            }}
            className={optionalCname}
            value={timeValue}
            readOnly={readOnly}
            onChange={(newValue) => {
              setTimeValue(newValue);
              onChange({
                target: {
                  name,
                  value: newValue?.format("HH:mm:ss"), // Return the time in the correct format
                },
              });
            }}
          />
        </LocalizationProvider>
      ) : type === "date-range" ? (
        <DateRangePicker
          value={value}
          onChange={(value) => onChange({ target: { name, value } })}
          format={"MM/dd/yyyy"}
          placeholder={label}
          showOneCalendar
          size="lg"
          shouldDisableDate={beforeToday()}
          className={optionalCname}
        />
      ) : type === "message" ? (
        <Box sx={{ width: "100%" }}>
          <ReactQuill
            value={value || ""}
            onChange={(newValue) => {
              onChange({
                target: {
                  name,
                  value: newValue,
                },
              });
            }}
            placeholder="Type your message here..."
            theme="snow" // Use 'snow' theme
            style={{ minHeight: 150, width: '100%' }} // Optional: You can set the height of the editor
          />
        </Box>
      ) : type === "autocomplete" ? (
        <Autocomplete
          sx={{ minWidth: "280px" }}
          open={open}
          onOpen={handleOpenAutocomplete}
          onClose={handleCloseAutocomplete}
          options={[...new Set(options)]}
          isOptionEqualToValue={(option, value) => option === value}
          getOptionLabel={(option) => option}
          loading={loading}
          required={required}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          value={value}
          onChange={(event, newValue) => {
            onChange({ target: { name, value: newValue } });
          }}
        />
      ) : type === 'address' ?
        <Address_Google_Map_Field
          label={label}
          value={value ? value : ""} // Ensure value is set if it exists
          onChange={(data) => {
            onChange({ target: { name, value: data } });
          }}
          cName={optionalCname}
          multiple={multiple}
          readOnly={readOnly}
        />
        : type === 'file' ? uploadedFile ? (
          <>
            <p>File already uploaded: <a href={uploadedFile} target="_blank" rel="noopener noreferrer">file</a></p>

            <TextField
              label={label}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              autoComplete="off"
              error={error}
              helperText={helperText}
              fullWidth={width}
              type='file'
              size="small"
              className={optionalCname}
              required={false}
            />
          </>
        ) : (<TextField
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          error={error}
          helperText={helperText}
          fullWidth={width}
          type='file'
          size="small"
          className={optionalCname}
          required={required}
        />) : type === 'phone_number' ? (<TextField
          hiddenLabel
          variant="outlined"
          name={name}
          value={value}
          placeholder="+91 XXXXX-XXXXX"
          className={optionalCname}
          size="small"
          error={error}
          disabled={disable}
          inputProps={{
            inputMode: "numeric",
            maxLength: 15, // +91 12345-67890
            readOnly,
          }}
          onFocus={(e) => {
            if (!e.target.value) {
              onChange({
                target: { name, value: "+91 " },
              });
            }
          }}
          onChange={(e) => {
            const formatted = formatIndianMobile(e.target.value);

            onChange({
              target: {
                name,
                value: formatted,
              },
            });
          }}
        />
        )
          : type ? (
            <TextField
              label={label}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              autoComplete="off"
              error={error}
              helperText={helperText}
              fullWidth={width}
              type={type}
              size="small"
              className={optionalCname}
              required={required}
              inputProps={{ readOnly: readOnly }}
            />
          ) : (
            <Box className="label_group">
              <Typography className="label">{label}</Typography>
              {(btn === "Add" || btn === "add") ? (
                <Link className="btn-link" onClick={handleAddClick}>
                  {btn}
                </Link>
              ) : (btn === "Remove" || btn === "remove") && (
                <Link className="btn-link remove" onClick={handleRemoveClick}>
                  {btn}
                </Link>
              )}
            </Box>
          )}
    </>
  );
}
