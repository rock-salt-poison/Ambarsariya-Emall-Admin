import * as React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers';

export default function FormFields({
  label,
  name,
  value,
  btn,
  onChange,
  placeholder,
  error,
  width=true,
  helperText,
  type,  // Default is 'text', can be 'password' or 'select'
  options = [],  // For Select field options
  handleBtnClick,
  optionalCname
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const [timeValue, setTimeValue] = React.useState(
    value ? dayjs(value, 'HH:mm:ss') : null
  );


  React.useEffect(() => {
    if (value) {
      if (type === 'time') {
        setTimeValue(dayjs(value, 'HH:mm:ss')); // Parse time format correctly
      } else if (type === 'date') {
        setTimeValue(dayjs(value));
      }
    }
  }, [value, type]);

  return (
    <>
      {type === 'select' ? (
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
      ) : type === 'password' ? (
        <FormControl variant="outlined" fullWidth size="small">
          <InputLabel htmlFor="outlined-adornment-password" size="small">{label}</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={value}
            name={name}
            onChange={onChange}
            
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'hide the password' : 'display the password'}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff fontSize='small'/> : <Visibility fontSize='small'/>}
                </IconButton>
              </InputAdornment>
            }
            label={label}
            autoComplete="new-password"
            size="small"
          />
        </FormControl>
      ) 
      : type === 'date' ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={label}
            name={name}
            sx={{
              [`& .MuiInputBase-input`]: {
                padding: '8px 14px',
              },
              ['& .MuiFormLabel-root']: { top: '-8px' },
            }}
            className={optionalCname}
            value={timeValue}
            onChange={(newValue) => {
              setTimeValue(newValue);
              onChange({ target: { name, value: newValue?.toISOString() } });
            }}
          />
        </LocalizationProvider>
      ) : type === 'time' ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label={label}
            name={name}
            sx={{
              [`& .MuiInputBase-input`]: {
                padding: '8px 14px',
              },
              ['& .MuiFormLabel-root']: { top: '-8px' },
            }}
            className={optionalCname}
            value={timeValue}
            onChange={(newValue) => {
              setTimeValue(newValue);
              onChange({
                target: {
                  name,
                  value: newValue?.format('HH:mm:ss'), // Return the time in the correct format
                },
              });
            }}
          />
        </LocalizationProvider>
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
        />
      ): (
        <Box className="label_group">
          <Typography className='label'>{label}</Typography>
          {btn && <Link className='btn-link' onClick={handleBtnClick}>{btn}</Link>}
        </Box>
      )}
    </>
  );
}
