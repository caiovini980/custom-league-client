import { Divider, List, Paper, Stack, Typography } from '@mui/material';
import { useAudio } from '@render/hooks/useAudioManager';
import { ConversationButton } from '@render/layouts/Home/SideBar/ViewActions/Conversations/ConversationButton';
import { ConversationHeader } from '@render/layouts/Home/SideBar/ViewActions/Conversations/ConversationHeader';
import { ConversationsArea } from '@render/layouts/Home/SideBar/ViewActions/Conversations/ConversationsArea';
import { useViewActionButtonContext } from '@render/layouts/Home/SideBar/ViewActions/ViewActionButton';
import { chatStore } from '@render/zustand/stores/chatStore';
import { useEffect } from 'react';

export const Conversations = () => {
  const actionButtonContext = useViewActionButtonContext();

  const sfxChatClose = useAudio('sfx-soc-ui-chatwindow-close');
  const sfxChatOpen = useAudio('sfx-soc-ui-chatwindow-open');

  const conversations = chatStore.conversations.use();
  const conversationActive = chatStore.conversationActive.use();

  useEffect(() => {
    if (actionButtonContext.isActive) {
      sfxChatOpen.replay();
    } else {
      sfxChatClose.replay();
    }
  }, [actionButtonContext.isActive]);

  return (
    <Stack
      direction={'row'}
      width={600}
      height={300}
      component={Paper}
      variant={'outlined'}
      overflow={'auto'}
    >
      {!conversations.length && (
        <Typography textAlign={'center'}>...</Typography>
      )}
      <List
        disablePadding
        sx={{ height: '100%', flexShrink: 0, overflow: 'auto' }}
      >
        {conversations.map((c) => {
          return <ConversationButton key={c.id} conversation={c} />;
        })}
      </List>
      <Divider orientation={'vertical'} flexItem />
      {conversationActive ? (
        <ConversationsArea conversation={conversationActive} />
      ) : (
        <div style={{ width: '100%' }}>
          <ConversationHeader />
        </div>
      )}
    </Stack>
  );
};
