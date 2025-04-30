import { ClickAwayListener, IconButton, Stack, Tooltip } from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { PositionPreference } from '@shared/typings/lol/request/lolLobbyV2LobbyMembersLocalMemberPositionPreferences';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { useState } from 'react';

interface PositionIconProps {
  member: LolLobbyV2Lobby['members'][number];
  isOwner: boolean;
}

export const PositionIcon = ({ member, isOwner }: PositionIconProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { positionIcon } = useLeagueImage();

  const iconSize = 20;

  const [tooltipOpen, setTooltipOpen] = useState('');

  const changePosition = (
    location: 'first' | 'second',
    position: PositionPreference,
  ) => {
    const firstPreference =
      location === 'first'
        ? position
        : (member.firstPositionPreference as PositionPreference);
    const secondPreference =
      location === 'second'
        ? position
        : (member.secondPositionPreference as PositionPreference);
    makeRequest(
      'PUT',
      '/lol-lobby/v2/lobby/members/localMember/position-preferences',
      {
        firstPreference,
        secondPreference,
      },
    );
  };

  const titleTooltip = (location: 'first' | 'second') => {
    const positionList: PositionPreference[] = [
      'TOP',
      'JUNGLE',
      'MIDDLE',
      'BOTTOM',
      'UTILITY',
      'FILL',
    ];
    return (
      <Stack direction={'row'} columnGap={1}>
        {positionList
          .filter((p) => p !== member.firstPositionPreference)
          .map((p) => (
            <IconButton key={p} onClick={() => changePosition(location, p)}>
              {icon(p)}
            </IconButton>
          ))}
      </Stack>
    );
  };

  const icon = (position: string) => {
    return (
      <img
        alt={position}
        src={positionIcon(position)}
        style={{ width: iconSize, height: iconSize }}
      />
    );
  };

  return (
    <ClickAwayListener onClickAway={() => setTooltipOpen('')}>
      <Stack
        direction={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        columnGap={2}
      >
        {[member.firstPositionPreference, member.secondPositionPreference].map(
          (position, i) => (
            <Tooltip
              key={i}
              title={titleTooltip(i === 0 ? 'first' : 'second')}
              arrow
              open={position === tooltipOpen}
              slotProps={{
                tooltip: {
                  sx: {
                    background: (t) => t.palette.grey['800'],
                  },
                },
              }}
            >
              <IconButton
                disabled={!isOwner}
                onClick={() => setTooltipOpen(position)}
                sx={{
                  display:
                    i === 1 && member.firstPositionPreference === 'FILL'
                      ? 'none'
                      : undefined,
                }}
              >
                {icon(position)}
              </IconButton>
            </Tooltip>
          ),
        )}
      </Stack>
    </ClickAwayListener>
  );
};
