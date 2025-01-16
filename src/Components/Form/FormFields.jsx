import * as React from "react";
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
import { DateRangePicker } from 'rsuite';
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import Font from "@ckeditor/ckeditor5-font/src/font";

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
  options = [], // For select/autocomplete field options
  handleAddClick,
  handleRemoveClick,
  optionalCname,
  required,
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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

  const [timeValue, setTimeValue] = React.useState(
    value ? dayjs(value, "HH:mm:ss") : null
  );

  React.useEffect(() => {
    if (value) {
      if (type === "time") {
        setTimeValue(dayjs(value, "HH:mm:ss")); // Parse time format correctly
      } else if (type === "date") {
        setTimeValue(dayjs(value));
      }
    }
  }, [value, type]);

  return (
    <>
      {type === "select" ? (
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel>{label}</InputLabel>
          <Select
            value={value}
            onChange={onChange}
            label={label}
            size="small"
            name={name}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option}>
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
          size="lg"
          shouldDisableDate={beforeToday()}
          className={optionalCname}
        />
      ) : type === "message" ? (
        <Box sx={{ width: "100%" }}>
          <CKEditor
            name={name}
            editor={ClassicEditor}
            data={value || ""}
            onChange={(event, editor) => {
              const data = editor.getData();
              onChange({
                target: {
                  name,
                  value: data, // Return the time in the correct format
                },
              });
            }}
            config={{
              plugins: [...ClassicEditor.builtinPlugins], // Add Font plugin
              toolbar: [
                "heading",
                "|",
                "fontFamily",
                "fontSize",
                "bold",
                "italic",
                "underline",
                "|",
                "bulletedList",
                "numberedList",
                "|",
                "blockQuote",
                "link",
                "undo",
                "redo",
              ],
              fontFamily: {
                options: [
                  "default",
                  "Arial, Helvetica, sans-serif",
                  "Courier New, Courier, monospace",
                  "Georgia, serif",
                  "Lucida Sans Unicode, Lucida Grande, sans-serif",
                  "Tahoma, Geneva, sans-serif",
                  "Times New Roman, Times, serif",
                  "Trebuchet MS, Helvetica, sans-serif",
                  "Verdana, Geneva, sans-serif",
                ],
              },
              fontSize: {
                options: [10, 12, 14, "default", 18, 20, 22, 24, 28],
                supportAllValues: true,
              },
              placeholder: "Type your message here...",
            }}
          />
        </Box>
      ) : type === "autocomplete" ? (
        <Autocomplete
          sx={{ minWidth: "280px" }}
          open={open}
          onOpen={handleOpenAutocomplete}
          onClose={handleCloseAutocomplete}
          options={options}
          isOptionEqualToValue={(option, value) => option === value}
          getOptionLabel={(option) => option}
          loading={loading}
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
      ) : type ? (
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
        />
      ) : (
        <Box className="label_group">
          <Typography className="label">{label}</Typography>
          {(btn==="Add" || btn==="add") ? (
            <Link className="btn-link" onClick={handleAddClick}>
              {btn}
            </Link>
          ): (btn==="Remove" || btn==="remove") && (
            <Link className="btn-link remove" onClick={handleRemoveClick}>
              {btn}
            </Link>
          )}
        </Box>
      )}
    </>
  );
}
