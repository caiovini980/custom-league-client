import { Box } from '@mui/material';
import { forwardRef, PropsWithChildren } from 'react';
import Slider, { Settings } from 'react-slick';

export const CustomCarousel = forwardRef<Slider, PropsWithChildren<Settings>>(
  ({ children, ...carouselProps }, ref) => {
    return (
      <Box
        height={'100%'}
        flexShrink={0}
        width={'100%'}
        position={'relative'}
        sx={{
          '& .slick-slider, .slick-list, .slick-track, .slick-slide > div': {
            height: '100%',
          },
          '& .slick-arrow': {
            height: '100%',
            width: 40,
            opacity: 0.3,
          },
          '& .slick-arrow:hover': {
            background: '#2c2c2c',
            opacity: 0.6,
          },
          '& .slick-arrow:before': {
            fontSize: 32,
          },
          '& .slick-next': {
            right: 0,
            zIndex: 9,
          },
          '& .slick-prev': {
            left: 0,
            zIndex: 9,
          },
        }}
      >
        <Slider
          ref={ref}
          {...carouselProps}
          appendDots={(dots) => (
            <div style={{ position: 'absolute', bottom: 0 }}>
              <Box
                component={'ul'}
                sx={{
                  m: 0,
                  p: 0,
                  '& > li': {
                    m: 0,
                  },
                  '& > li button:before': {
                    fontSize: 10,
                    color: 'white',
                    opacity: 0.5,
                  },
                  ' & > li.slick-active button:before': {
                    color: 'white',
                    opacity: 1,
                  },
                }}
              >
                {dots}
              </Box>
            </div>
          )}
        >
          {/*@ts-ignore*/}
          {children}
        </Slider>
      </Box>
    );
  },
);
