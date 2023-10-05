import { apiSlice } from '../login/loginApiSlice';

export const extendedSocialSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeedsUserInfo: builder.query({
      query: ({ userId }) => `/get/feed/userInfo?userId=${userId}`,
      providesTags: (result, error, args) => [
        { type: 'feedUser', id: args.userId },
        { type: 'feedUser', id: 'LIST' },
      ],
    }),
    getFeedsCount: builder.query({
      query: ({ userId }) => `/get/feed/count?userId=${userId}`,
      providesTags: (result, error, args) =>
        result
          ? [
              { type: 'feedCount', id: args.userId },
              { type: 'feedCount', id: 'LIST' },
            ]
          : [{ type: 'feedCount', id: 'LIST' }],
    }),
    getFeedsIsFollow: builder.query({
      query: ({ userId, target }) =>
        `/get/feed/isFollow?userId=${userId}&target=${target}`,
      providesTags: (result, error, args) =>
        result ? [{ type: 'feedIsFollow', id: args.target }] : [],
    }),
    getFeeds: builder.query({
      query: ({ userId, limit, filter }) =>
        `/get/feed/social?userId=${userId}&limit=${limit}&filter=${filter}`,
      providesTags: (result, error, args) =>
        result
          ? [
              ...result.map((article) => ({
                type: 'social',
                id: article.id,
              })),
              { type: 'social', id: 'LIST' },
            ]
          : [{ type: 'social', id: 'LIST' }],
    }),
    getFeedsMore: builder.mutation({
      query: ({ ids, modified, userId, limit, filter }) => ({
        url: '/post/feed/social/more',
        method: 'post',
        body: { ids, modified, userId, limit, filter },
      }),
      onQueryStarted: async (
        { userId, limit, filter },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              'getFeeds',
              { userId, limit, filter },
              (draft) => {
                draft.push(...data.list);
              }
            )
          );
        } catch (error) {}
      },
    }),
    getFeedsFollowers: builder.query({
      query: ({ userId }) => `/get/feed/followers?userId=${userId}`,
      providesTags: (result, error, args) =>
        result ? [{ type: 'feedFollowers', id: args.userId }] : [],
    }),
    getFeedsFollowings: builder.query({
      query: ({ userId }) => `/get/feed/followings?userId=${userId}`,
      providesTags: (result, error, args) =>
        result ? [{ type: 'feedFollowings', id: args.userId }] : [],
    }),
    postFeedsEditDesc: builder.mutation({
      query: ({ userId, desc }) => ({
        url: '/post/feed/userInfo/edit',
        method: 'post',
        body: { userId, desc },
      }),
      onQueryStarted: async (
        { userId, desc },
        { dispatch, queryFulfilled }
      ) => {
        try {
          await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              'getFeedsUserInfo',
              { userId },
              (draft) => {
                draft.desc = desc;
              }
            )
          );
        } catch (error) {}
      },
    }),
    postFeedsToggleFollow: builder.mutation({
      query: ({ userId, target }) => ({
        url: '/post/feed/follow/toggle',
        method: 'post',
        body: { userId, target },
      }),
      invalidatesTags: (result, error, args) =>
        result
          ? [
              { type: 'feedCount', id: args.userId },
              { type: 'feedCount', id: args.target },
              { type: 'feedIsFollow', id: args.target },
              { type: 'feedFollowers', id: args.target },
              { type: 'feedFollowings', id: args.userId },
            ]
          : [],
    }),
    postFeedsSearchUser: builder.mutation({
      query: ({ searchWord }) => ({
        url: '/post/feed/searchUser',
        method: 'post',
        body: { searchWord },
      }),
    }),
  }),
});

export const {
  useGetFeedsUserInfoQuery,
  useGetFeedsCountQuery,
  useGetFeedsIsFollowQuery,
  useGetFeedsQuery,
  useGetFeedsMoreMutation,
  useGetFeedsFollowersQuery,
  useGetFeedsFollowingsQuery,
  usePostFeedsEditDescMutation,
  usePostFeedsToggleFollowMutation,
  usePostFeedsSearchUserMutation,
} = extendedSocialSlice;
