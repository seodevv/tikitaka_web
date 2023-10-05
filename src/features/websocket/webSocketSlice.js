import { io } from 'socket.io-client';
import { createSlice } from '@reduxjs/toolkit';

export const LOGIN = 'login';
export const SEND_MESSGAE_TO_TARGET = 'sendMessageToTarget';
export const RECEIVE_MESSAGE_FORM_TARGET = 'receiveMessageFromTarget';
export const SEND_TYPING_TO_TARGET = 'sendTypingToTarget';
export const RECEIVE_TYPING_FROM_TARGET = 'receiveTargetFromTarget';

const initialState = {
  socket: null,
};

const webSocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    wsConnect: (state, action) => {
      console.log('web socket connected');
      state.socket = io(process.env.WEB_SOCKET_URL, {
        withCredentials: true,
      });
      state.socket.emit(LOGIN, action.payload);
    },
    wsDisconnect: (state, action) => {
      if (state.socket) {
        console.log('web socket disconnected');
        state.socket.close();
        state.socket = null;
      }
    },
  },
});

const webSocketReducer = webSocketSlice.reducer;
export default webSocketReducer;
export const { wsConnect, wsDisconnect } = webSocketSlice.actions;
export const selectWebSocket = (state) => state.ws.socket;
