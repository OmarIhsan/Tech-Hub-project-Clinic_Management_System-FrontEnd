import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface FormInputProps extends Omit<TextFieldProps, 'variant' | 'error' | 'helperText'> {
  error?: boolean | string;
  helperText?: string;
}

const FormInput = React.forwardRef<HTMLDivElement, FormInputProps>(
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