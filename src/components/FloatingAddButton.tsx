import { Fab, FabProps } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface FloatingAddButtonProps extends FabProps {
  onClick?: () => void;
  ariaLabel?: string;
}

const FloatingAddButton = ({ onClick, ariaLabel = 'add', ...props }: FloatingAddButtonProps) => (
  <Fab
    color="primary"
    aria-label={ariaLabel}
    onClick={onClick}
    sx={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      zIndex: 1000,
      ...props.sx,
    }}
    {...props}
  >
    <AddIcon />
  </Fab>
);

export default FloatingAddButton;