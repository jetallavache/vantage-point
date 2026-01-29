import { createAction } from "@reduxjs/toolkit";
import {
  Author,
  CreateAuthorRequest,
  UpdateAuthorRequest,
  FetchAuthorsRequest,
} from "./types";

// Fetch authors
export const fetchAuthorsRequest = createAction<FetchAuthorsRequest>(
  "authors/fetchAuthorsRequest"
);
export const fetchAuthorsSuccess = createAction<{
  items: Author[];
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}>("authors/fetchAuthorsSuccess");
export const fetchAuthorsFailure = createAction<string>(
  "authors/fetchAuthorsFailure"
);

// Fetch author detail
export const fetchAuthorDetailRequest = createAction<number>(
  "authors/fetchAuthorDetailRequest"
);
export const fetchAuthorDetailSuccess = createAction<Author>(
  "authors/fetchAuthorDetailSuccess"
);
export const fetchAuthorDetailFailure = createAction<string>(
  "authors/fetchAuthorDetailFailure"
);

// Clear current author
export const clearCurrentAuthor = createAction("authors/clearCurrentAuthor");

// Create author
export const createAuthorRequest = createAction<CreateAuthorRequest>(
  "authors/createAuthorRequest"
);
export const createAuthorSuccess = createAction<Author>(
  "authors/createAuthorSuccess"
);
export const createAuthorFailure = createAction<string>(
  "authors/createAuthorFailure"
);

// Update author
export const updateAuthorRequest = createAction<UpdateAuthorRequest>(
  "authors/updateAuthorRequest"
);
export const updateAuthorSuccess = createAction<Author>(
  "authors/updateAuthorSuccess"
);
export const updateAuthorFailure = createAction<string>(
  "authors/updateAuthorFailure"
);

// Delete author
export const deleteAuthorRequest = createAction<number>(
  "authors/deleteAuthorRequest"
);
export const deleteAuthorSuccess = createAction<number>(
  "authors/deleteAuthorSuccess"
);
export const deleteAuthorFailure = createAction<string>(
  "authors/deleteAuthorFailure"
);
