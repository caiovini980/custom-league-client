import { CustomIconButton } from '@render/components/input';
import { FaEllipsisV } from 'react-icons/fa';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { Menu, MenuItem, MenuList } from '@mui/material';
import { useRef, useState } from 'react';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';

interface PlayerCardMenuProps {
  member: LolLobbyV2Lobby['members'][number];
  isCurrentLeader: boolean;
}

export const PlayerCardMenu = ({
  member,
  isCurrentLeader,
}: PlayerCardMenuProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();

  const profileModalRef = useRef<ProfileModalRef>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();

  const rcpFeLolPartiesTrans = rcpFeLolParties('trans');

  const onClickGrantInvite = () => {
    setAnchorEl(undefined);
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-lobby/v2/lobby/members/{digits}/grant-invite',
        member.summonerId,
      ),
      undefined,
    ).then();
  };

  const onClickRevokeInvite = () => {
    setAnchorEl(undefined);
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-lobby/v2/lobby/members/{digits}/revoke-invite',
        member.summonerId,
      ),
      undefined,
    ).then();
  };

  const onClickPromoteToLeader = () => {
    setAnchorEl(undefined);
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-lobby/v2/lobby/members/{digits}/promote',
        member.summonerId,
      ),
      undefined,
    ).then();
  };

  const onClickKick = () => {
    setAnchorEl(undefined);
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-lobby/v2/lobby/members/{digits}/kick',
        member.summonerId,
      ),
      undefined,
    ).then();
  };

  const onClickProfile = () => {
    setAnchorEl(undefined);
    profileModalRef.current?.open(member.summonerId);
  };

  return (
    <>
      <CustomIconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <FaEllipsisV size={12} />
      </CustomIconButton>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(undefined)}
      >
        <MenuList dense disablePadding>
          <MenuItem onClick={onClickProfile}>
            {rcpFeLolPartiesTrans('context_menu_view_profile')}
          </MenuItem>
          {isCurrentLeader && (
            <>
              <MenuItem onClick={onClickGrantInvite}>
                {rcpFeLolPartiesTrans('context_menu_grant_invite_privilege')}
              </MenuItem>
              <MenuItem onClick={onClickRevokeInvite}>
                {rcpFeLolPartiesTrans('context_menu_revoke_invite_privilege')}
              </MenuItem>
              <MenuItem onClick={onClickPromoteToLeader}>
                {rcpFeLolPartiesTrans('context_menu_promote_to_leader')}
              </MenuItem>
              <MenuItem onClick={onClickKick}>
                {rcpFeLolPartiesTrans('context_menu_kick')}
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
      <ProfileModal ref={profileModalRef} />
    </>
  );
};
