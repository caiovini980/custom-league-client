import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolLootV1PlayerLoot } from '@shared/typings/lol/response/lolLootV1PlayerLoot';
import { useLootUtil } from './useLootUtil';

interface LootTooltipProps {
  loot: LolLootV1PlayerLoot;
}

export const LootTooltip = ({ loot }: LootTooltipProps) => {
  const { lolGameDataImg, genericImg } = useLeagueImage();
  const { rcpFeLolLoot } = useLeagueTranslate();
  const { getLootName, getLootDescription } = useLootUtil();

  const { rcpFeLolLootTrans } = rcpFeLolLoot;

  if (loot.type === 'CHEST') {
    return (
      <Stack direction={'column'} rowGap={1} p={1}>
        <Typography textAlign={'center'}>{getLootName(loot)}</Typography>
        <Divider />
        <Typography fontSize={'0.8rem'}>{getLootDescription(loot)}</Typography>
      </Stack>
    );
  }

  const getTagIcon = () => {
    const tags = loot.tags.split(',');
    return tags
      .map((tag) => {
        if (tag === 'legacy') {
          return 'plugins/rcp-fe-lol-loot/global/default/assets/tag_icons/legacy.png';
        }
        if (tag.includes('rarity')) {
          return `plugins/rcp-fe-lol-loot/global/default/assets/tooltips/${tag}.png`;
        }
        return '';
      })
      .filter(Boolean);
  };

  const label = (
    key: string,
    value: string | number,
    currency: string,
    prefix: string,
  ) => {
    return (
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        sx={{
          '&  p': {
            fontSize: '0.8rem',
            color: 'var(--mui-palette-text-disabled)',
          },
        }}
      >
        <Typography>{rcpFeLolLootTrans(`loot_tooltip_${key}`)}</Typography>
        <Stack direction={'row'} alignItems={'center'}>
          <CircularIcon
            src={genericImg(
              `plugins/rcp-fe-lol-loot/global/default/assets/tray_icons/${currency.toLowerCase()}.png`,
            )}
            size={18}
          />
          <Typography width={40} textAlign={'right'}>
            {prefix}
            {value}
          </Typography>
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack
      direction={'column'}
      justifyContent={'flex-end'}
      height={240}
      width={300}
      position={'relative'}
      p={1}
      sx={{
        background: `linear-gradient(0deg, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 80%), url(${lolGameDataImg(loot.splashPath)})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        position={'absolute'}
        component={Paper}
        variant={'outlined'}
        top={0}
        right={0}
        p={0.5}
      >
        <Typography fontSize={'0.7rem'}>
          {rcpFeLolLootTrans(`loot_tooltip_short_${loot.redeemableStatus}`)}
        </Typography>
      </Box>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography>{getLootName(loot)}</Typography>
        <Stack direction={'row'} alignItems={'center'}>
          <CircularIcon
            src={genericImg(
              `plugins/rcp-fe-lol-loot/global/default/assets/tray_icons/${loot.disenchantLootName.toLowerCase()}.png`,
            )}
            size={18}
          />
          <Typography width={40} textAlign={'right'}>
            {loot.value}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction={'row'} alignItems={'center'} columnGap={0.5}>
        {getTagIcon().map((url) => (
          <CircularIcon key={url} src={genericImg(url)} size={16} />
        ))}
        <Typography color={'textDisabled'} fontSize={'0.7rem'}>
          {rcpFeLolLootTrans(`loot_type_${loot.type.toLowerCase()}`)}
        </Typography>
      </Stack>
      <Divider sx={{ my: 1 }} />
      {label('disenchant', loot.disenchantValue, loot.disenchantLootName, '+')}
      {label('upgrade', loot.upgradeEssenceValue, loot.disenchantLootName, '-')}
    </Stack>
  );
};
