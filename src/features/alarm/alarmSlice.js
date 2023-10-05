import { apiSlice } from '../login/loginApiSlice';

export const extendedAlarmSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAlarmList: builder.query({
      query: ({ target }) => `/get/alarm/list?target=${target}`,
    }),
    getAlarmCount: builder.query({
      query: ({ target }) => `/get/alarm/count?target=${target}`,
      providesTags: [{ type: 'alarmCount', id: 'LIST' }],
    }),
    postAlarmIsRead: builder.mutation({
      query: ({ target }) => ({
        url: '/post/alarm/isRead',
        method: 'post',
        body: { target },
      }),
      invalidatesTags: [{ type: 'alarmCount', id: 'LIST' }],
    }),
    postSubscribe: builder.mutation({
      query: ({ subscription, userId }) => ({
        url: '/webpush/subscribe',
        method: 'post',
        body: { subscription, userId },
      }),
    }),
    postUnSubscribe: builder.mutation({
      query: ({ endpoint, userId }) => ({
        url: '/webpush/unSubscribe',
        method: 'post',
        body: { endpoint, userId },
      }),
    }),
  }),
});

export const {
  useGetAlarmListQuery,
  useGetAlarmCountQuery,
  usePostAlarmIsReadMutation,
  usePostSubscribeMutation,
  usePostUnSubscribeMutation,
} = extendedAlarmSlice;
