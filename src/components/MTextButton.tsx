import { Button, ButtonProps } from '@mui/material';
import { LinkProps } from 'react-router';

type MTextButtonProps = ButtonProps & Partial<LinkProps>;

const MTextButton = (props: MTextButtonProps) => {
  return (
    <Button
      variant="text"
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

export default MTextButton;