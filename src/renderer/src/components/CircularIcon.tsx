import { Avatar, Box } from '@mui/material';

interface CircularIconProps {
  src: string;
  size?: number;
  grayScale?: boolean;
}

export const CircularIcon = ({
  src,
  size = 20,
  grayScale = false,
}: CircularIconProps) => {
  if (!src) {
    return <Box height={size} width={size} />;
  }
  return (
    <Avatar
      variant={'circular'}
      src={src}
      sx={{
        height: size,
        width: size,
        filter: `grayscale(${grayScale ? 1 : 0})`,
      }}
    />
  );
};
