import { createReducer } from "@reduxjs/toolkit";
import { TagsState } from "./types";
import {
  fetchTagsRequest,
  fetchTagsSuccess,
  fetchTagsFailure,
  fetchTagDetailRequest,
  fetchTagDetailSuccess,
  fetchTagDetailFailure,
  createTagRequest,
  createTagSuccess,
  createTagFailure,
  updateTagRequest,
  updateTagSuccess,
  updateTagFailure,
  deleteTagRequest,
  deleteTagSuccess,
  deleteTagFailure,
} from "./actions";

const initialState: TagsState = {
  items: [],
  currentTag: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,
  perPage: 9,
};

export const tagsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchTagsRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTagsSuccess, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.total = action.payload.total;
      state.perPage = action.payload.perPage;
    })
    .addCase(fetchTagsFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchTagDetailRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTagDetailSuccess, (state, action) => {
      state.loading = false;
      state.currentTag = action.payload;
    })
    .addCase(fetchTagDetailFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(createTagRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createTagSuccess, (state, action) => {
      state.loading = false;
      state.items.unshift(action.payload);
      state.total += 1;
    })
    .addCase(createTagFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updateTagRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateTagSuccess, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    })
    .addCase(updateTagFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(deleteTagRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteTagSuccess, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    })
    .addCase(deleteTagFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});
