import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  typings: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addTypings: (state, action) => {
      state.typings.push(action.payload);
      state.typings = [...new Set(state.typings)];
    },
    removeTypings: (state, action) => {
      const index = state.typings.findIndex((v) => v.chatId === action.payload);
      state.typings.splice(index, 1);
    },
  },
});

const chatReducer = chatSlice.reducer;
export default chatReducer;
export const { addTypings, removeTypings } = chatSlice.actions;

export const selectTypings = (state) => state.chat.typings;
export const selectTypingById = createSelector(
  (state) => state.chat.typings,
  (state, chatId) => chatId,
  (typings, chatId) => {
    return typings.find((typing) => typing === chatId);
  }
);
