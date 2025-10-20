import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type FormInputProps = TextFieldProps & {
  error?: boolean | string | null;
  helperText?: React.ReactNode;
};

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