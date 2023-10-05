import { apiSlice } from '../login/loginApiSlice';

export const extendedSettingsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNickDuplicated: builder.mutation({
      query: ({ nick }) => ({
        url: `/auth/nickDuplicated?nick=${nick}`,
        method: 'get',
      }),
    }),
    editProfile: builder.mutation({
      query: (formData) => ({
        url: '/post/upload/profile',
        method: 'post',
        body: formData,
      }),
      invalidatesTags: (result) => [
        { type: 'ChatMessage', id: 'LIST' },
        { type: 'social', id: 'LIST' },
        { type: 'feedUser', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetNickDuplicatedMutation, useEditProfileMutation } =
  extendedSettingsSlice;
