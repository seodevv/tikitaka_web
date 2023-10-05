import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/login/loginApiSlice';
import webSocketReducer, {
  SEND_MESSGAE_TO_TARGET,
  SEND_TYPING_TO_TARGET,
} from '../features/websocket/webSocketSlice';
import chatReducer from '../features/chat/chatReducer';
import loginReducer from '../features/login/loginReducer';
import socialReducer from '../features/social/socialReducer';

const store = configureStore({
  reducer: {
    ws: webSocketReducer,
    user: loginReducer,
    chat: chatReducer,
    social: socialReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware
    ),
  devTools: false,
});

export const chatMessageObject = (response, target) => ({
  id: response.id,
  chatId: response.chatId,
  userType: response.userType,
  userId: response.userId,
  userName: response.userName,
  email: response.email,
  nick: response.nick,
  birth: response.birth,
  regist: response.regist,
  profile: response.profile,
  type: response.type,
  message: response.message,
  date: response.date,
  target: target,
});

export const emitChatMessage = (response, target) => {
  const ws = store.getState().ws.socket;
  if (ws) {
    ws.emit(SEND_MESSGAE_TO_TARGET, chatMessageObject(response, target));
  }
};

export const emitTyping = (type, chatId, target) => {
  const ws = store.getState().ws.socket;
  if (ws) {
    ws.emit(SEND_TYPING_TO_TARGET, { type, chatId, target });
  }
};

export const updateUnreadCountQueryData = (chatId, creator) => {
  store.dispatch(
    apiSlice.util.updateQueryData(
      'getChatMessageUnreadCount',
      {
        chatId,
        creator,
      },
      (draft) => {
        draft.count += 1;
      }
    )
  );
};

export const updateChatListQueryData = (creator, text, data) => {
  store.dispatch(
    apiSlice.util.updateQueryData('getChatList', { creator }, (draft) => {
      const index = draft.findIndex((chat) => chat.id === data.chatId);

      if (index !== -1) {
        const chat = draft.splice(index, 1)[0];
        chat.messageId = data.id;
        chat.messageType = data.type;
        chat.message = text;
        chat.messageDate = data.date;
        draft.splice(0, 0, chat);
      }
    })
  );
};

export const updateChatMessageQueryData = (response) => {
  store.dispatch(
    apiSlice.util.updateQueryData(
      'getChatMessage',
      { chatId: response.chatId, limit: process.env.DEFAULT_CHAT_COUNT || 30 },
      (draft) => {
        const otherMessage = draft.find((v) => v.userId === response.userId);
        if (
          otherMessage &&
          (otherMessage.nick !== response.nick ||
            otherMessage.profile !== response.profile)
        ) {
          draft.forEach((v) => {
            if (v.userId === response.userId) {
              v.nick = response.nick;
              v.profile = response.profile;
            }
          });
        }
        draft.push(chatMessageObject(response));
      }
    )
  );
  store.dispatch(
    apiSlice.util.updateQueryData(
      'getChat',
      { chatId: response.chatId, creator: response.target },
      (draft) => {
        if (
          draft.nick !== response.nick ||
          draft.profile !== response.profile
        ) {
          draft.nick = response.nick;
          draft.profile = response.profile;
        }
        draft.message = response.message;
        draft.messageType = response.type;
        draft.messageDate = response.date;
      }
    )
  );
};

export default store;
