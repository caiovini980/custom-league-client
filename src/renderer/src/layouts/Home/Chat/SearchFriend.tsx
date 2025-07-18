import { Box, ClickAwayListener, Collapse } from '@mui/material';
import { CustomIconButton, CustomTextField } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface SearchFriendProps {
  onSearchChange: (value: string) => void;
}

export const SearchFriend = ({ onSearchChange }: SearchFriendProps) => {
  const { rcpFeLolSharedComponents } = useLeagueTranslate();

  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState('');

  const { rcpFeLolSharedComponentsTrans } = rcpFeLolSharedComponents;

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
            background: 'var(--mui-palette-background-default)',
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
                <MdClose size={14} />
              </CustomIconButton>
            }
          />
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};
