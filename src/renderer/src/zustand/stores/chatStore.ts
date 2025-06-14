import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { store } from '@davstack/store';

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
