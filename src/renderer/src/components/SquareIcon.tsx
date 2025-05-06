import { Avatar, Box } from '@mui/material';

interface SpellIconProps {
  src: string;
  size?: number;
  grayScale?: boolean;
}

export const SquareIcon = ({
  src,
  size = 20,
  grayScale = false,
}: SpellIconProps) => {
  if (!src) {
    return <Box height={size} width={size} />;
  }
  return (
    <Avatar
      variant={'square'}
      src={src}
      sx={{
        height: size,
        width: size,
        filter: `grayscale(${grayScale ? 1 : 0})`,
      }}
    />
  );
};
