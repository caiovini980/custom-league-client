import { Button, ButtonProps, CircularProgress } from '@mui/material';

export interface CustomButtonProps extends ButtonProps {
  id: string;
  loading?: boolean;
}

const CustomButton = ({ loading, ...props }: CustomButtonProps) => {
  return (
    <Button size={'small'} {...props} disabled={loading || props.disabled}>
      {loading ? (
        <CircularProgress color={'inherit'} size={22.75} />
      ) : (
        props.children
      )}
    </Button>
  );
};

export default CustomButton;
