import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filter: { user: '', tags: [], follower: '', period: 'recent' },
  message: { flag: false, message: '' },
  creative: { flag: false, processing: false },
  article: { flag: false, id: -1, ids: [] },
  modal: { flag: false, id: -1, userId: -1, type: '', edit: false },
  viewport: { width: 0, height: 0 },
  onAction: { refresh: false, onTop: false, top: 0 },
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    addFilter: (state, action) => {
      switch (action.payload.type) {
        case 'user':
          state.filter.user = action.payload.value;
          break;
        case 'tag':
          const already = state.filter.tags.find(
            (tag) => tag === action.payload.value
          );
          if (already) return;
          if (state.filter.tags.length >= 3) {
            state.message.flag = true;
            state.message.message = '태그 검색은 최대 3개까지 가능합니다.';
            return;
          }
          state.filter.tags.push(action.payload.value);
          break;
        case 'follower':
          state.filter.follower = action.payload.value;
          break;
        case 'period':
          state.filter.period = action.payload.value;
          break;
        default:
          break;
      }
    },
    removeFilter: (state, action) => {
      switch (action.payload.type) {
        case 'user':
          state.filter.user = '';
          break;
        case 'tags':
          state.filter.tags.splice(action.payload.index, 1);
          break;
        case 'follower':
          state.filter.follower = '';
          break;
        case 'period':
          state.filter.period = 'recent';
          break;
        default:
          break;
      }
    },
    showMessage: (state, action) => {
      state.message.flag = true;
      state.message.message = action.payload;
    },
    closeMessage: (state) => {
      state.message.flag = false;
      state.message.message = '';
    },
    showCreative: (state) => {
      state.creative.flag = true;
    },
    closeCreative: (state) => {
      state.creative.flag = false;
    },
    processingCreative: (state, action) => {
      state.creative.processing = action.payload;
    },
    showArticle: (state, action) => {
      state.article.flag = true;
      state.article.id = action.payload.id;
      state.article.ids = action.payload.ids ? action.payload.ids : [];
    },
    closeArticle: (state) => {
      state.article.flag = false;
      state.article.id = -1;
      state.article.ids = [];
    },
    showModal: (state, action) => {
      state.modal.flag = true;
      state.modal.id = action.payload.id;
      state.modal.userId = action.payload.userId;
      state.modal.type = action.payload.type;
    },
    setModal: (state, action) => {
      state.modal.edit = action.payload;
      state.modal.flag = false;
    },
    closeModal: (state) => {
      state.modal.flag = false;
      state.modal.id = -1;
      state.modal.userId = -1;
      state.modal.type = '';
      state.modal.edit = false;
    },
    setViewPort: (state, action) => {
      state.viewport.width = action.payload.width;
      state.viewport.height = action.payload.height;
    },
    setOnAction: (state, action) => {
      state.onAction[action.payload.type] = action.payload.value;
    },
  },
});

const socialReducer = socialSlice.reducer;
export default socialReducer;
export const {
  addFilter,
  removeFilter,
  showMessage,
  closeMessage,
  showCreative,
  closeCreative,
  processingCreative,
  showArticle,
  closeArticle,
  showModal,
  setModal,
  closeModal,
  setViewPort,
  setOnAction,
} = socialSlice.actions;
export const selectFilter = (state) => state.social.filter;
export const selectMessage = (state) => state.social.message;
export const selectCreative = (state) => state.social.creative;
export const selectArticle = (state) => state.social.article;
export const selectModal = (state) => state.social.modal;
export const selectViewPort = (state) => state.social.viewport;
export const selectOnAction = (state) => state.social.onAction;
export const selectOnActionTop = (state) => state.social.onAction.top;
