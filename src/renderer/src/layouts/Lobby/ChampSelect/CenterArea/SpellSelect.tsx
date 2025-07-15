import { Grid, Stack } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import {
  CustomIconButton,
  CustomIconButtonTooltip,
} from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { useState } from 'react';

export const SpellSelect = () => {
  const { currentPlayer, gameMode } = useChampSelectContext();
  const { spellIcon } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const spells = gameDataStore.spells.use();

  const [loadingChangeSpell, setLoadingChangeSpell] = useState(false);

  const { spell1Id, spell2Id } = currentPlayer;

  const iconSize = 30;

  const onChangeSpell = (position: 'first' | 'second', spellId: number) => {
    let spell1 = spell1Id;
    let spell2 = spell2Id;

    if (position === 'first') {
      spell1 = spellId;
    }
    if (position === 'second') {
      spell2 = spellId;
    }

    // Change spell position 1 -> 2
    if (spell1 === spell2Id) {
      spell2 = spell1Id;
    }

    // Change spell position 2 -> 1
    if (spell2 === spell1Id) {
      spell1 = spell2Id;
    }

    setLoadingChangeSpell(true);
    makeRequest('PATCH', '/lol-champ-select/v1/session/my-selection', {
      spell1Id: spell1,
      spell2Id: spell2,
    })
      .then()
      .finally(() => {
        setLoadingChangeSpell(false);
      });
  };

  const SpellBox = (position: 'first' | 'second') => {
    const filtered = spells.filter((s) => {
      const spellIgnore = position === 'first' ? spell1Id : spell2Id;
      const isInclude = s.gameModes.includes(gameMode);
      return isInclude && spellIgnore !== s.id;
    });

    return (
      <Grid container columns={4} justifyContent={'center'}>
        {filtered.map((s) => (
          <Grid key={s.id}>
            <CustomIconButton
              onClick={() => onChangeSpell(position, s.id)}
              disabled={loadingChangeSpell}
            >
              <SquareIcon src={spellIcon(s.id)} size={40} />
            </CustomIconButton>
          </Grid>
        ))}
      </Grid>
    );
  };

  const disabled = (spellId: number) => {
    return currentPlayer.assignedPosition === 'jungle' && spellId === 11; //Smite;
  };

  return (
    <Stack direction={'row'} columnGap={0.5}>
      <CustomIconButtonTooltip
        placement={'top'}
        openTooltipOnClick
        title={SpellBox('first')}
        disabled={disabled(spell1Id)}
      >
        <SquareIcon src={spellIcon(spell1Id)} size={iconSize} />
      </CustomIconButtonTooltip>
      <CustomIconButtonTooltip
        placement={'top'}
        openTooltipOnClick
        title={SpellBox('second')}
        disabled={disabled(spell2Id)}
      >
        <SquareIcon src={spellIcon(spell2Id)} size={iconSize} />
      </CustomIconButtonTooltip>
    </Stack>
  );
};
