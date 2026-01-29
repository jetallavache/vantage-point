import { createReducer } from "@reduxjs/toolkit";
import { AuthorsState } from "./types";
import {
  fetchAuthorsRequest,
  fetchAuthorsSuccess,
  fetchAuthorsFailure,
  fetchAuthorDetailRequest,
  fetchAuthorDetailSuccess,
  fetchAuthorDetailFailure,
  clearCurrentAuthor,
  createAuthorRequest,
  createAuthorSuccess,
  createAuthorFailure,
  updateAuthorRequest,
  updateAuthorSuccess,
  updateAuthorFailure,
  deleteAuthorRequest,
  deleteAuthorSuccess,
  deleteAuthorFailure,
} from "./actions";

const initialState: AuthorsState = {
  items: [],
  currentAuthor: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,
  perPage: 9,
};

export const authorsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchAuthorsRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAuthorsSuccess, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.total = action.payload.total;
      state.perPage = action.payload.perPage;
    })
    .addCase(fetchAuthorsFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchAuthorDetailRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAuthorDetailSuccess, (state, action) => {
      state.loading = false;
      state.currentAuthor = action.payload;
    })
    .addCase(fetchAuthorDetailFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(clearCurrentAuthor, (state) => {
      state.currentAuthor = null;
    })
    .addCase(createAuthorRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createAuthorSuccess, (state, action) => {
      state.loading = false;
      state.items.unshift(action.payload);
      state.total += 1;
    })
    .addCase(createAuthorFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updateAuthorRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateAuthorSuccess, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    })
    .addCase(updateAuthorFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(deleteAuthorRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteAuthorSuccess, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    })
    .addCase(deleteAuthorFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
});
