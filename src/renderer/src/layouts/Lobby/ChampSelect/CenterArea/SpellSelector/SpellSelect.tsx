import { Stack } from '@mui/material';
import { CustomIconButtonTooltip } from '@render/components/input';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { SpellsContainer } from '@render/layouts/Lobby/ChampSelect/CenterArea/SpellSelector/SpellsContainer';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';

export const SpellSelect = () => {
  const { spellIcon } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const assignedPosition = champSelectStore.getCurrentSummonerData(
    (s) => s.assignedPosition,
    'middle',
  );
  const { spell1Id, spell2Id } = champSelectStore.spells.use();

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

    makeRequest('PATCH', '/lol-champ-select/v1/session/my-selection', {
      spell1Id: spell1,
      spell2Id: spell2,
    }).then();
  };

  const disabled = (spellId: number) => {
    return assignedPosition === 'jungle' && spellId === 11; //Smite;
  };

  return (
    <Stack direction={'row'} columnGap={0.5}>
      <CustomIconButtonTooltip
        placement={'top'}
        openTooltipOnClick
        title={
          <SpellsContainer
            spellSelected={spell1Id}
            onChangeSpell={(spellId) => onChangeSpell('first', spellId)}
          />
        }
        disabled={disabled(spell1Id)}
      >
        <SquareIcon src={spellIcon(spell1Id)} size={iconSize} />
      </CustomIconButtonTooltip>
      <CustomIconButtonTooltip
        placement={'top'}
        openTooltipOnClick
        title={
          <SpellsContainer
            spellSelected={spell2Id}
            onChangeSpell={(spellId) => onChangeSpell('second', spellId)}
          />
        }
        disabled={disabled(spell2Id)}
      >
        <SquareIcon src={spellIcon(spell2Id)} size={iconSize} />
      </CustomIconButtonTooltip>
    </Stack>
  );
};
