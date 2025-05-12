import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useEffect, useState } from 'react';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { LolPerksV1Pages } from '@shared/typings/lol/response/lolPerksV1Pages';
import { Stack, Tooltip, Typography } from '@mui/material';
import { CustomIconButton, CustomTextField } from '@render/components/input';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { LolPerksV1Styles } from '@shared/typings/lol/response/lolPerksV1Styles';
import { useLeagueImage } from '@render/hooks/useLeagueImage';

export const RuneEdit = () => {
  const { lolGameDataImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();

  const [rune, setRune] = useState<LolPerksV1Pages>();
  const [perks, setPerks] = useState<LolPerksV1Styles[]>([]);

  useLeagueClientEvent('/lol-perks/v1/currentpage', (data) => {
    setRune(data);
  });

  useLeagueClientEvent('/lol-perks/v1/styles', (data) => {
    setPerks(data);
  });

  if (!rune) return null;

  return (
    <Stack direction={'column'} p={3}>
      <Stack direction={'row'} columnGap={1} width={'min-content'}>
        <CustomTextField value={rune.name} sx={{ width: 300 }} />
        <CustomIconButton disabled>
          <FaPlus size={16} />
        </CustomIconButton>
        <CustomIconButton>
          <FaTrash size={16} />
        </CustomIconButton>
      </Stack>
      <Stack direction={'row'}>
        <Stack direction={'column'}>
          <Stack direction={'row'}>
            {perks.map((perk) => {
              return (
                <Tooltip key={perk.id} title={perk.name}>
                  <CustomIconButton>
                    <img
                      src={lolGameDataImg(perk.iconPath)}
                      height={25}
                      alt={perk.name}
                    />
                  </CustomIconButton>
                </Tooltip>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
