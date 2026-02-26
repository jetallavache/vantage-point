import { createReducer } from "@reduxjs/toolkit";
import { PostsState } from "./types";
import {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  fetchPostDetailRequest,
  fetchPostDetailSuccess,
  fetchPostDetailFailure,
  createPostRequest,
  createPostSuccess,
  createPostFailure,
  updatePostRequest,
  updatePostSuccess,
  updatePostFailure,
  deletePostRequest,
  deletePostSuccess,
  deletePostFailure,
  clearPostFormErrors,
} from "./actions";

const initialState: PostsState = {
  items: [],
  currentPost: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  total: 0,
  perPage: 10,
  isSubmitting: false,
};

export const postsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchPostsRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchPostsSuccess, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.total = action.payload.total;
    })
    .addCase(fetchPostsFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchPostDetailRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchPostDetailSuccess, (state, action) => {
      state.loading = false;
      state.currentPost = action.payload;
    })
    .addCase(fetchPostDetailFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(createPostRequest, (state) => {
      state.isSubmitting = true;
      state.validationErrors = undefined;
      state.formError = undefined;
    })
    .addCase(createPostSuccess, (state) => {
      state.isSubmitting = false;
    })
    .addCase(createPostFailure, (state, action) => {
      state.isSubmitting = false;
      const error = action.payload;
      if (error.kind === "validation") {
        state.validationErrors = error.fields;
      } else if (error.kind === "form") {
        state.formError = error.message;
      } else {
        state.formError = error.message;
      }
    })
    .addCase(updatePostRequest, (state) => {
      state.isSubmitting = true;
      state.validationErrors = undefined;
      state.formError = undefined;
    })
    .addCase(updatePostSuccess, (state) => {
      state.isSubmitting = false;
    })
    .addCase(updatePostFailure, (state, action) => {
      state.isSubmitting = false;
      const error = action.payload;
      if (error.kind === "validation") {
        state.validationErrors = error.fields;
      } else if (error.kind === "form") {
        state.formError = error.message;
      } else {
        state.formError = error.message;
      }
    })
    .addCase(deletePostRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deletePostSuccess, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
    })
    .addCase(deletePostFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(clearPostFormErrors, (state) => {
      state.validationErrors = undefined;
      state.formError = undefined;
    });
});
