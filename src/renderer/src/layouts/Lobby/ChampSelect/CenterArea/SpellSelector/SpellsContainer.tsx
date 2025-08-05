import { ButtonBase, Divider, Grid, Stack, Typography } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { SummonerSpells } from '@shared/typings/lol/json/summoner-spells';
import { useEffect, useState } from 'react';

interface SpellsContainerProps {
  spellSelected: number;
  onChangeSpell: (spellId: number) => void;
}

export const SpellsContainer = ({
  onChangeSpell,
  spellSelected,
}: SpellsContainerProps) => {
  const { spellIcon } = useLeagueImage();
  const gameMode = champSelectStore.gameMode.use();
  const spells = gameDataStore.spells.use();

  const [spellOver, setSpellOver] = useState<SummonerSpells>();

  const filtered = spells.filter((s) => s.gameModes.includes(gameMode));

  useEffect(() => {
    const spell = spells.find((s) => s.id === spellSelected);
    setSpellOver(spell);
  }, [spellSelected]);

  return (
    <Stack direction={'column'} rowGap={2} alignItems={'center'}>
      <Typography fontSize={'1.4rem'}>{spellOver?.name}</Typography>
      <Typography>{spellOver?.description}</Typography>
      <Divider flexItem variant={'middle'} />
      <Grid container justifyContent={'center'} spacing={2}>
        {filtered.map((s) => (
          <Grid key={s.id} size={3} display={'flex'} alignItems={'center'}>
            <ButtonBase
              onClick={() => onChangeSpell(s.id)}
              onMouseOver={() => setSpellOver(s)}
              disabled={spellSelected === s.id}
              sx={{
                m: 'auto',
                p: 0.5,
                border:
                  spellSelected === s.id
                    ? '2px solid var(--mui-palette-primary-main)'
                    : undefined,
              }}
            >
              <SquareIcon src={spellIcon(s.id)} size={40} />
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
