import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText 
} from '@mui/material';

const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  error,
  helperText,
  disabled = false,
  required = false,
  placeholder = '',
  ...props
}) => {
  const hasError = Boolean(error);
  const errorText = typeof error === 'string' ? error : helperText;

  return (
    <FormControl 
      fullWidth 
      margin="normal" 
      error={hasError}
      disabled={disabled}
      {...props}
    >
      <InputLabel required={required}>
        {label}
      </InputLabel>
      <Select
        value={value || ''}
        onChange={onChange}
        label={label}
        displayEmpty={Boolean(placeholder)}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          
          return (
            <MenuItem key={optionValue} value={optionValue}>
              {optionLabel}
            </MenuItem>
          );
        })}
      </Select>
      {errorText && (
        <FormHelperText>{errorText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectField;