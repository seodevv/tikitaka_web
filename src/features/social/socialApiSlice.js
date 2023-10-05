import { apiSlice } from '../login/loginApiSlice';

export const extendedSocialSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSocial: builder.query({
      query: ({ socialId }) => `/get/social/article?socialId=${socialId}`,
      providesTags: (result, error, args) =>
        result ? [{ type: 'social', id: args.socialId }] : [],
    }),
    getSocialRecent: builder.query({
      query: ({ limit, filter }) =>
        `/get/social/article/recent?limit=${limit}&filter=${JSON.stringify(
          filter
        )}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((social) => ({ type: 'social', id: social.id })),
              { type: 'social', id: 'LIST' },
            ]
          : [{ type: 'social', id: 'LIST' }],
    }),
    getSocialMore: builder.mutation({
      query: ({ ids, modified, limit, filter }) => ({
        url: '/post/social/article/more',
        method: 'post',
        body: { ids, modified, limit, filter },
      }),
      onQueryStarted: async ({ filter }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              'getSocialRecent',
              { limit: process.env.POST_LIMIT || 10, filter },
              (draft) => {
                draft.push(...data);
              }
            )
          );
        } catch (error) {}
      },
    }),
    addSocial: builder.mutation({
      query: (formData) => ({
        url: '/post/upload/social',
        method: 'post',
        body: formData,
      }),
      invalidatesTags: () => [
        { type: 'social', id: 'LIST' },
        { type: 'feedCount', id: 'LIST' },
      ],
    }),
    editSocial: builder.mutation({
      query: ({ socialId, content, tags }) => ({
        url: '/post/social/article/edit',
        method: 'post',
        body: { socialId, content, tags },
      }),
      invalidatesTags: (result, error, args) => [
        { type: 'social', id: args.socialId },
      ],
    }),
    deleteSocial: builder.mutation({
      query: ({ socialId }) => ({
        url: '/post/social/article/delete',
        method: 'post',
        body: { socialId },
      }),
      invalidatesTags: (result, error, args) => [
        { type: 'social', id: args.socialId },
        { type: 'feedCount', id: 'LIST' },
      ],
    }),
    searchSocial: builder.mutation({
      query: ({ searchWord }) => ({
        url: '/post/social/article/search',
        method: 'post',
        body: { searchWord },
      }),
    }),
    uploadTempVideo: builder.mutation({
      query: (formData) => ({
        url: '/post/upload/video/temp/add',
        method: 'post',
        body: formData,
      }),
    }),
    deleteTempVideo: builder.mutation({
      query: ({ creator, filename, thumbnails }) => ({
        url: '/post/upload/video/temp/delete',
        method: 'post',
        body: { creator, filename, thumbnails },
      }),
    }),
    editTempVideo: builder.mutation({
      query: ({ creator, video }) => ({
        url: '/post/upload/video/temp/edit',
        method: 'post',
        body: { creator, video },
      }),
    }),
    getThumbnail: builder.mutation({
      query: ({ url, width }) => ({
        url: '/post/upload/thumbnail',
        method: 'post',
        body: { url, width },
      }),
    }),
    getReaction: builder.query({
      query: ({ socialId, userId }) =>
        `/get/social/reaction?socialId=${socialId}&userId=${userId}`,
      providesTags: (result, error, args) =>
        result ? [{ type: 'reactions', id: args.socialId }] : [],
    }),
    getReactionCount: builder.query({
      query: ({ socialId }) =>
        `/get/social/reaction/count?socialId=${socialId}`,
      providesTags: (result, error, args) =>
        result ? [{ type: 'reactionCount', id: args.socialId }] : [],
    }),
    toggleReaction: builder.mutation({
      query: ({ type, socialId, userId }) => ({
        url: '/post/social/reaction/toggle',
        method: 'post',
        body: { type, socialId, userId },
      }),
      invalidatesTags: (result, error, args) => [
        { type: 'reactions', id: args.socialId },
        { type: 'reactionCount', id: args.socialId },
      ],
      onQueryStarted: async (
        { type, userId },
        { dispatch, queryFulfilled }
      ) => {
        try {
          if (type !== 'bookmark') return;
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              'getFeeds',
              {
                userId,
                limit: process.env.FEED_LIMIT || 20,
                filter: 'bookmark',
              },
              (draft) => {
                const index = draft.findIndex((v) => v.id === data.id);
                if (index === -1) {
                  draft.push(data);
                  draft.sort((a, b) => {
                    if (a.modified > b.modified) return -1;
                    else if (a.modified < b.modified) return 1;
                  });
                } else {
                  draft.splice(index, 1);
                }
              }
            )
          );
        } catch (error) {}
      },
    }),
    getComment: builder.query({
      query: ({ socialId }) => `/get/social/comment?socialId=${socialId}`,
      providesTags: (result, error, args) =>
        result ? [{ type: 'comment', id: args.socialId }] : [],
    }),
    addComment: builder.mutation({
      query: ({ socialId, creator, target, comment }) => ({
        url: '/post/social/comment/add',
        method: 'post',
        body: { socialId, creator, target, comment },
      }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: 'commentCount', id: args.socialId }] : [],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              'getComment',
              { socialId: data.socialId },
              (draft) => {
                draft.push(data);
              }
            )
          );
        } catch (error) {}
      },
    }),
    deleteComment: builder.mutation({
      query: ({ id, socialId }) => ({
        url: '/post/social/comment/delete',
        method: 'post',
        body: { id, socialId },
      }),
      invalidatesTags: (result, error, args) =>
        result ? [{ type: 'commentCount', id: args.socialId }] : [],
      onQueryStarted: async (
        { id, socialId },
        { dispatch, queryFulfilled }
      ) => {
        try {
          await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              'getComment',
              { socialId },
              (draft) => {
                const index = draft.findIndex((v) => v.id === id);
                draft.splice(index, 1);
              }
            )
          );
        } catch (error) {}
      },
    }),
    getCommentCount: builder.query({
      query: ({ socialId }) => `/get/social/comment/count?socialId=${socialId}`,
      providesTags: (result, error, args) =>
        result ? [{ type: 'commentCount', id: args.socialId }] : [],
    }),
    searchTag: builder.mutation({
      query: ({ searchTag }) => ({
        url: '/post/social/tags/search',
        method: 'post',
        body: { searchTag },
      }),
    }),
    getEmojiType: builder.query({
      query: () => `/get/social/emojisType`,
    }),
    getEmojis: builder.query({
      query: (type) => `/get/social/emojis?${type ? `type=${type}` : ''}`,
    }),
    searchEmojis: builder.mutation({
      query: ({ searchWord }) => ({
        url: '/post/social/emojis/search',
        method: 'post',
        body: { searchWord },
      }),
    }),
  }),
});

export const {
  useGetSocialQuery,
  useGetSocialRecentQuery,
  useGetSocialMoreMutation,
  useAddSocialMutation,
  useEditSocialMutation,
  useDeleteSocialMutation,
  useSearchSocialMutation,
  useUploadTempVideoMutation,
  useDeleteTempVideoMutation,
  useEditTempVideoMutation,
  useGetThumbnailMutation,
  useGetReactionQuery,
  useGetReactionCountQuery,
  useToggleReactionMutation,
  useGetCommentQuery,
  useAddCommentMutation,
  useGetCommentCountQuery,
  useDeleteCommentMutation,
  useSearchTagMutation,
  useGetEmojiTypeQuery,
  useGetEmojisQuery,
  useSearchEmojisMutation,
} = extendedSocialSlice;
