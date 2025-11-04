import { store } from '@davstack/store';
import { Null } from '@shared/typings/generic.typing';
import { LolChatV1Conversations } from '@shared/typings/lol/response/lolChatV1Conversations';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';

export interface ChatState {
  friends: LolChatV1Friends[];
  conversations: LolChatV1Conversations[];
  conversationActive: Null<LolChatV1Conversations>;
}

const initialState: ChatState = {
  friends: [],
  conversations: [],
  conversationActive: null,
};

export const chatStore = store(initialState, {
  name: 'chat',
  devtools: { enabled: true },
}).actions((state) => ({
  resetState: () => {
    state.set(initialState);
  },
  selectConversationActive: (conversationId: Null<string>) => {
    if (conversationId === null) {
      state.conversationActive.set(null);
      return;
    }
    const con = state.conversations.get((con) =>
      con.find((c) => c.id === conversationId),
    );
    const currentConversation = state.conversationActive.get();
    if (currentConversation?.id !== con?.id) {
      state.conversationActive.set(con ?? null);
    }
  },
}));
