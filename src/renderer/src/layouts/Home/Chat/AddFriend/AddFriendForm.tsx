import { Stack, Typography } from '@mui/material';
import { CustomButton, CustomTextField } from '@render/components/input';
import { useState } from 'react';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

interface AddFriendFormProps {
  addFriend: (gameName: string, tagLine: string) => Promise<boolean>;
}

export const AddFriendForm = ({ addFriend }: AddFriendFormProps) => {
  const { rcpFeLolSocial, rcpFeLolSharedComponents } = useLeagueTranslate();

  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;
  const { rcpFeLolSharedComponentsTrans } = rcpFeLolSharedComponents;

  const onClickAddFriend = () => {
    addFriend(gameName, tagLine).then((isSuccess) => {
      if (!isSuccess) return;
      setTagLine('');
      setGameName('');
    });
  };

  return (
    <Stack direction={'column'} rowGap={2}>
      <Typography>
        {rcpFeLolSocialTrans('friend_finder_modal_instructions_alias')}
      </Typography>
      <Stack direction={'row'} columnGap={2} width={'100%'}>
        <CustomTextField
          fullWidth
          label={rcpFeLolSharedComponentsTrans(
            'player_name_input_game_name_hint_text',
          )}
          value={gameName}
          onChangeText={setGameName}
        />
        <CustomTextField
          label={rcpFeLolSharedComponentsTrans(
            'player_name_input_tag_line_hint_text',
          )}
          startIcon={'#'}
          value={tagLine}
          onChangeText={setTagLine}
        />
        <CustomButton
          variant={'contained'}
          fullWidth
          sx={{ maxWidth: '150px' }}
          onClick={onClickAddFriend}
        >
          {rcpFeLolSocialTrans('tooltip_new_friend')}
        </CustomButton>
      </Stack>
    </Stack>
  );
};
