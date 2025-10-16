import { Button, ButtonProps } from '@mui/material';
import { LinkProps } from 'react-router-dom';

type MButtonProps = ButtonProps & Partial<LinkProps>;

const MButton = (props: MButtonProps) => {
  return (
    <Button
      variant="contained"
      color="primary"
      type={props.type || 'button'}
      {...props}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        fontFamily: 'Dubai, Arial, sans-serif',
        ...props.sx,
      }}
    >
      {props.children}
    </Button>
  );
};

export default MButton;