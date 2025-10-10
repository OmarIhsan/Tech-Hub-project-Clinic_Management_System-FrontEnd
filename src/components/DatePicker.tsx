import React from 'react';
import { 
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  CalendarToday as CalendarIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const DatePicker = ({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  minDate,
  maxDate,
  ...props
}) => {
  const hasError = Boolean(error);
  const errorText = typeof error === 'string' ? error : helperText;

  const handleDateChange = (event) => {
    const newValue = event.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
  };

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    
    if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue;
    }
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  return (
    <TextField
      type="date"
      label={label}
      value={formatDateForInput(value)}
      onChange={handleDateChange}
      error={hasError}
      helperText={errorText}
      disabled={disabled}
      required={required}
      fullWidth
      margin="normal"
      variant="outlined"
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        min: minDate ? formatDateForInput(minDate) : undefined,
        max: maxDate ? formatDateForInput(maxDate) : undefined,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {value && !disabled && (
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
                title="Clear date"
              >
                <ClearIcon />
              </IconButton>
            )}
            <CalendarIcon color="action" />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default DatePicker;