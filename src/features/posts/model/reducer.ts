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
      state.loading = true;
      state.error = null;
    })
    .addCase(createPostSuccess, (state) => {
      state.loading = false;
    })
    .addCase(createPostFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updatePostRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updatePostSuccess, (state) => {
      state.loading = false;
    })
    .addCase(updatePostFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
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
    });
});
