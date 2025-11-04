import { ButtonBase, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

interface SaleCardProps {
  onClick: () => void;
  imgUrl: string;
  title: string;
  alreadyEnabled: boolean;
  prices: {
    currency: 'RP';
    price: number;
    discount: number;
    priceWithDiscount: number;
  }[];
}

export const SaleCard = ({
  title,
  imgUrl,
  prices,
  onClick,
  alreadyEnabled,
}: SaleCardProps) => {
  const { genericImg } = useLeagueImage();
  const { rcpFeLolPaw } = useLeagueTranslate();

  const { rcpFeLolPawTrans } = rcpFeLolPaw;

  return (
    <Stack
      component={ButtonBase}
      className={'theme-dark'}
      direction={'column'}
      justifyContent={'flex-end'}
      height={'100%'}
      width={'100%'}
      onClick={onClick}
      disabled={alreadyEnabled}
      sx={{
        background: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Stack
        direction={'column'}
        width={'100%'}
        height={125}
        sx={{
          p: 1,
          pb: '25px',
          background: (t) => alpha(t.palette.common.black, 0.7),
        }}
      >
        <Typography
          color={'textPrimary'}
          fontSize={'1.2rem'}
          textAlign={'center'}
        >
          {title}
        </Typography>
        {alreadyEnabled && (
          <Stack
            justifyContent={'center'}
            border={'1px solid var(--mui-palette-divider)'}
            p={1}
          >
            {rcpFeLolPawTrans('cat_paw_error_validation_item_owned')}
          </Stack>
        )}
        <Stack
          direction={'row'}
          columnGap={1}
          justifyContent={'center'}
          display={alreadyEnabled ? 'none' : 'flex'}
        >
          {prices.map((p, i) => (
            <Stack
              key={i}
              direction={'row'}
              columnGap={1}
              justifyContent={'center'}
              border={'1px solid var(--mui-palette-divider)'}
              p={1}
            >
              <Stack
                direction={'column'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                <CircularIcon
                  src={genericImg(
                    'plugins/rcp-fe-lol-static-assets/global/default/icon-rp-24.png',
                  )}
                  size={16}
                />
                <Typography color={'textPrimary'} fontSize={'0.75rem'}>
                  {Math.floor(p.discount * 100)}%
                </Typography>
              </Stack>
              <Stack direction={'column'}>
                <Typography fontSize={'1.2rem'} color={'highlight'}>
                  {p.priceWithDiscount}
                </Typography>
                <Typography fontSize={'0.65rem'} color={'textDisabled'}>
                  {p.price}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
