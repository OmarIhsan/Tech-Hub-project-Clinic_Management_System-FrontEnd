import { Button, ButtonProps } from '@mui/material';
import { LinkProps } from 'react-router-dom';

type MOutlineButtonProps = ButtonProps & Partial<LinkProps>;

const MOutlineButton = (props: MOutlineButtonProps) => {
  return (
    <Button
      variant="outlined"
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

export default MOutlineButton;