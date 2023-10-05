import { chatMessageObject } from '../../app/store';
import { apiSlice } from '../login/loginApiSlice';

const updateChatMessageQueryData = ({ data, dispatch, apiSlice }) => {
  dispatch(
    apiSlice.util.updateQueryData(
      'getChatMessage',
      { chatId: data.chatId, limit: process.env.DEFAULT_CHAT_COUNT || 30 },
      (draft) => {
        draft.push(chatMessageObject(data));
      }
    )
  );
  dispatch(
    apiSlice.util.updateQueryData(
      'getChat',
      { chatId: data.chatId, creator: data.userId },
      (draft) => {
        draft.message = data.message;
        draft.messageType = data.type;
        draft.messageDate = data.date;
      }
    )
  );
};

export const extendedChatSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMenu: builder.query({
      query: () => '/get/menus',
    }),
    getUser: builder.query({
      query: ({ id }) => `/get/user?id=${id}`,
    }),
    getChat: builder.query({
      query: ({ chatId, creator }) =>
        `/get/chat?chatId=${chatId}&creator=${creator}`,
      providesTags: (result, error, args) => [
        { type: 'Chat', id: args.chatId },
      ],
    }),
    getChatList: builder.query({
      query: ({ creator }) => `/get/chat/list?creator=${creator}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((chat) => ({ type: 'ChatList', id: chat.id })),
              { type: 'ChatList', id: 'LIST' },
            ]
          : [{ type: 'ChatList', id: 'LIST' }],
    }),
    getChatMessage: builder.query({
      query: ({ chatId, limit }) =>
        `/get/chat/message?&chatId=${chatId}&limit=${limit}`,
      providesTags: (result, error, args) =>
        result
          ? [
              { type: 'ChatMessage', id: args.chatId },
              { type: 'ChatMessage', id: 'LIST' },
            ]
          : [{ type: 'ChatMessage', id: 'LIST' }],
    }),
    getChatMessageUnreadCount: builder.query({
      query: ({ chatId, creator }) =>
        `/get/chat/unReadCount?chatId=${chatId}&creator=${creator}`,
      providesTags: (result, error, args) => [
        { type: 'UnRead', id: args.chatId },
      ],
    }),
    getOpenGraph: builder.query({
      query: ({ url }) => `/get/chat/opengraph?url=${url}`,
    }),
    addChat: builder.mutation({
      query: ({ creator, target, id }) => ({
        url: '/post/chat/add',
        method: 'post',
        body: { id, creator, target },
      }),
      invalidatesTags: (result) =>
        result && !result.exist ? [{ type: 'ChatList', id: 'LIST' }] : [],
    }),
    addChatMessage: builder.mutation({
      query: ({ chatId, creator, message }) => ({
        url: '/post/chat/message/add',
        method: 'post',
        body: { chatId, creator, message },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          updateChatMessageQueryData({ data, dispatch, apiSlice });
        } catch (error) {
          console.error(error);
        }
      },
    }),
    addChatMessageImage: builder.mutation({
      queryFn: async (
        { chatId, creator, image },
        { dispatch },
        _extraOpitons,
        baseQuery
      ) => {
        const formData = new FormData();
        formData.append('type', 'message');
        formData.append('chatId', chatId);
        formData.append('creator', creator);
        formData.append('image', image);
        try {
          const response = await baseQuery({
            url: '/post/upload/image',
            method: 'post',
            body: formData,
          });
          updateChatMessageQueryData({
            data: response.data,
            dispatch,
            apiSlice,
          });
          return response;
        } catch (error) {
          console.error('[RTK addChatMessageImage]', error);
        }
      },
    }),
    getSearchUsers: builder.mutation({
      query: ({ searchId, id }) => ({
        url: '/post/searchUsers',
        method: 'post',
        body: { searchId, id },
      }),
    }),
    getChatMessageById: builder.mutation({
      query: ({ id, chatId, limit }) => ({
        url: '/post/chat/message',
        method: 'post',
        body: { id, chatId, limit },
      }),
      onQueryStarted: async (
        { chatId, limit },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            apiSlice.util.updateQueryData(
              'getChatMessage',
              { chatId, limit },
              (draft) => {
                draft.splice(0, 0, ...data);
              }
            )
          );
        } catch (error) {}
      },
    }),
    updateChatDate: builder.mutation({
      query: ({ chatId }) => ({
        url: '/post/chat/date/update',
        method: 'post',
        body: { chatId },
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'ChatList', id: 'LIST' }] : [],
    }),
    updateChatPined: builder.mutation({
      query: ({ chatId, creator }) => ({
        url: '/post/chat/pined/update',
        method: 'post',
        body: { chatId, creator },
      }),
      invalidatesTags: (result, error, args) => [
        { type: 'ChatList', id: args.chatId },
        { type: 'Chat', id: args.chatId },
      ],
    }),
    updateChatMessageUnRead: builder.mutation({
      query: ({ chatId, creator }) => ({
        url: '/post/chat/unRead/update',
        method: 'post',
        body: { chatId, creator },
      }),
      invalidatesTags: (result, error, args) => [
        { type: 'UnRead', id: args.chatId },
      ],
    }),
    disableChat: builder.mutation({
      query: ({ chatId, creator }) => ({
        url: '/post/chat/disable',
        method: 'post',
        body: { chatId, creator },
      }),
      invalidatesTags: (result, error, args) => [
        { type: 'ChatList', id: args.chatId },
      ],
    }),
  }),
});

export const {
  useGetMenuQuery,
  useGetUserQuery,
  useGetChatQuery,
  useGetChatListQuery,
  useGetChatMessageQuery,
  useGetChatMessageUnreadCountQuery,
  useGetSearchUsersMutation,
  useGetChatMessageByIdMutation,
  useGetOpenGraphQuery,
  useAddChatMutation,
  useAddChatMessageMutation,
  useAddChatMessageImageMutation,
  useUpdateChatDateMutation,
  useUpdateChatPinedMutation,
  useUpdateChatMessageUnReadMutation,
  useDisableChatMutation,
} = extendedChatSlice;
