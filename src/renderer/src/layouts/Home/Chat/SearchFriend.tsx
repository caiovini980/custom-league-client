import { CustomIconButton, CustomTextField } from '@render/components/input';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Box, ClickAwayListener, Collapse } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

interface SearchFriendProps {
  onSearchChange: (value: string) => void;
}

export const SearchFriend = ({ onSearchChange }: SearchFriendProps) => {
  const { rcpFeLolSharedComponents } = useLeagueTranslate();

  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState('');

  const rcpFeLolSharedComponentsTrans = rcpFeLolSharedComponents('trans');

  const handleCloseSearch = () => {
    setOpenSearch(false);
    setSearch('');
  };

  useEffect(() => {
    onSearchChange(search);
  }, [search]);

  return (
    <ClickAwayListener onClickAway={handleCloseSearch}>
      <Box>
        <CustomIconButton onClick={() => setOpenSearch(true)} sx={{ p: 1 }}>
          <FaSearch size={14} />
        </CustomIconButton>
        <Collapse
          in={openSearch}
          sx={{
            position: 'absolute',
            zIndex: 2,
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            background: (t) => t.palette.background.default,
          }}
        >
          <CustomTextField
            fullWidth
            value={search}
            onChangeText={setSearch}
            placeholder={rcpFeLolSharedComponentsTrans(
              'player_name_input_game_name_hint_text',
            )}
            endIcon={
              <CustomIconButton onClick={handleCloseSearch}>
                <FaTimes size={14} />
              </CustomIconButton>
            }
          />
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};
