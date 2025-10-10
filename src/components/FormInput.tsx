import React from 'react';
import { TextField } from '@mui/material';

const FormInput = React.forwardRef(
  ({ error, helperText, ...props }, ref) => {
    const hasError = Boolean(error);
    const errorText = typeof error === 'string' ? error : helperText;

    return (
      <TextField
        ref={ref}
        error={hasError}
        helperText={errorText}
        variant="outlined"
        fullWidth
        margin="normal"
        {...props}
      />
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;