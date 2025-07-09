import { store } from '@davstack/store';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';

export interface ChatState {
  friends: LolChatV1Friends[];
}

const initialState: ChatState = {
  friends: [],
};

export const chatStore = store(initialState, {
  name: 'chat',
  devtools: { enabled: true },
}).actions((state) => ({
  resetState: () => {
    state.set(initialState);
  },
}));
