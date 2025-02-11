import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBiTug7g7l2EycWEMVnQ9rVwFPjSCDi9GM';

function loadScript(src, position, id) {
  if (!position) return;

  if (!document.querySelector(`#${id}`)) {
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('defer', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
  }
}

const autocompleteService = { current: null };

export default function Address_Google_Map_Field({ value, label, onChange }) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !loaded.current) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps'
      );
      loaded.current = true;
    }
  }, []);

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        if (autocompleteService.current) {
          autocompleteService.current.getPlacePredictions(request, callback);
        }
      }, 400),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) return;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = value ? [value, ...results] : results;
        setOptions(newOptions || []);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      sx={{ width: 300 }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      size="small"
      noOptionsText="No locations"
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={label || 'Add a location'} fullWidth />
      )}
      renderOption={(props, option) => {
        const matches =
          option.structured_formatting?.main_text_matched_substrings || [];
        const parts = parse(
          option.structured_formatting?.main_text || '',
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <li {...props}>
            <Grid container sx={{ alignItems: 'center' }}>
              <Grid item sx={{ display: 'flex', width: 44 }}>
                <LocationOnIcon sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid
                item
                sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}
              >
                {parts.map((part, index) => (
                  <Box
                    key={index}
                    component="span"
                    sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {option.structured_formatting?.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
