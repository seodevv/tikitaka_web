import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.SERVER_URL,
  credentials: 'include',
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User',
    'Chat',
    'ChatList',
    'ChatMessage',
    'UnRead',
    'reactions',
    'reactionCount',
    'social',
    'comment',
    'commentCount',
    'feedUser',
    'feedCount',
    'feedIsFollow',
    'feedArticle',
    'feedFollowers',
    'feedFollowings',
    'alarmCount',
  ],
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => `/auth/getUserInfo`,
      providesTags: [{ type: 'User', id: 'LIST' }],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'post',
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    getCompared: builder.mutation({
      query: (initialUser) => ({
        url: '/auth/compare',
        method: 'post',
        body: initialUser,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    getDuplicated: builder.mutation({
      query: (userId) => ({
        url: '/auth/duplicate',
        method: 'post',
        body: { userId },
      }),
    }),
    addUser: builder.mutation({
      query: (initialUser) => ({
        url: '/auth/signup',
        method: 'post',
        body: initialUser,
      }),
    }),
    sendAuthCode: builder.mutation({
      query: ({ type, target }) => ({
        url: '/auth/sendAuthCode',
        method: 'post',
        body: { type, target },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    oauthLogin: builder.mutation({
      queryFn: async (
        { token, type },
        _baseQueryApi,
        _extraOptions,
        baseQuery
      ) => {
        try {
          let oauthResponse;
          let body = new Object();
          let config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          switch (type) {
            case 'google':
              oauthResponse = await axios.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                config
              );
              body.type = type;
              body.id = oauthResponse.data.id;
              body.email = oauthResponse.data.email;
              body.name = oauthResponse.data.name;
              body.picture = oauthResponse.data.picture;
              break;
            case 'kakao':
              oauthResponse = await axios.get(
                'https://kapi.kakao.com/v2/user/me',
                config
              );
              body.type = type;
              body.id = oauthResponse.data.id;
              body.email = oauthResponse.data.kakao_account.email || null;
              body.name = oauthResponse.data.properties.nickname;
              body.picture =
                oauthResponse.data.properties.profile_image || 'profile.png';
              break;
            case 'naver':
              break;
          }
          const response = await baseQuery({
            url: '/auth/oauthLogin',
            method: 'post',
            body: body,
          });

          return response;
        } catch (error) {}
      },
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useLogoutMutation,
  useGetComparedMutation,
  useGetDuplicatedMutation,
  useAddUserMutation,
  useSendAuthCodeMutation,
  useOauthLoginMutation,
} = apiSlice;
