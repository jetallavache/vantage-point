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
  deleteBulkAuthorsRequest,
  deleteBulkAuthorsSuccess,
  deleteBulkAuthorsFailure,
  clearAuthorFormErrors,
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
  isSubmitting: false,
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
      state.isSubmitting = true;
      state.validationErrors = undefined;
      state.formError = undefined;
    })
    .addCase(createAuthorSuccess, (state, action) => {
      state.isSubmitting = false;
      state.items.unshift(action.payload);
      state.total += 1;
    })
    .addCase(createAuthorFailure, (state, action) => {
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
    .addCase(updateAuthorRequest, (state) => {
      state.isSubmitting = true;
      state.validationErrors = undefined;
      state.formError = undefined;
    })
    .addCase(updateAuthorSuccess, (state, action) => {
      state.isSubmitting = false;
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    })
    .addCase(updateAuthorFailure, (state, action) => {
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
    })
    .addCase(deleteBulkAuthorsRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteBulkAuthorsSuccess, (state, action) => {
      state.loading = false;
      state.items = state.items.filter(
        (item) => !action.payload.includes(item.id)
      );
      state.total = Math.max(0, state.total - action.payload.length);
    })
    .addCase(deleteBulkAuthorsFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(clearAuthorFormErrors, (state) => {
      state.validationErrors = undefined;
      state.formError = undefined;
    });
});
