import { Box, BoxProps } from '@mui/material';
import { BoxTypeMap } from '@mui/system';
import { useLazyImage } from '@render/hooks/useLazyImage';
import { PropsWithChildren } from 'react';

type LazyImageProps<
  E extends React.ElementType = BoxTypeMap['defaultComponent'],
  AdditionalProps = {},
> = {
  src: string;
  background: (url: string) => string;
} & BoxProps<E, AdditionalProps>;

export const LazyImage = <E extends React.ElementType, A>({
  children,
  src,
  background,
  ...boxProps
}: PropsWithChildren<LazyImageProps<E, A>>) => {
  const { isVisible, containerRef } = useLazyImage();

  return (
    <Box
      ref={containerRef}
      style={{
        backgroundImage: isVisible ? background(src) : undefined,
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
};
