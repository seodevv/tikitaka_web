import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  userInfo: {
    type: 'App',
    nick: 'unknown',
    email: '',
    profile: 'profile.png',
    birth: '1900-01-01T00:00:00.000Z',
    regist: '1900-01-01T00:00:00.000Z',
  },
};

const loginSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state, action) => {
      state.userInfo = initialState;
    },
    editUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

const loginReducer = loginSlice.reducer;
export default loginReducer;
export const { login, logout, editUserInfo } = loginSlice.actions;
export const selectCreator = (state) => state.user.userInfo;
export const selectCreatorId = (state) => state.user.userInfo?.id;
