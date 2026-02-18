import { createAction } from "@reduxjs/toolkit";
import {
  Author,
  CreateAuthorRequest,
  UpdateAuthorRequest,
  FetchAuthorsRequest,
  FetchAuthorsSuccess,
} from "./types";

export const fetchAuthorsRequest = createAction<FetchAuthorsRequest>(
  "authors/fetchAuthorsRequest"
);
export const fetchAuthorsSuccess = createAction<FetchAuthorsSuccess>(
  "authors/fetchAuthorsSuccess"
);
export const fetchAuthorsFailure = createAction<string>(
  "authors/fetchAuthorsFailure"
);

export const fetchAuthorDetailRequest = createAction<number>(
  "authors/fetchAuthorDetailRequest"
);
export const fetchAuthorDetailSuccess = createAction<Author>(
  "authors/fetchAuthorDetailSuccess"
);
export const fetchAuthorDetailFailure = createAction<string>(
  "authors/fetchAuthorDetailFailure"
);

export const clearCurrentAuthor = createAction("authors/clearCurrentAuthor");

export const createAuthorRequest = createAction<CreateAuthorRequest>(
  "authors/createAuthorRequest"
);
export const createAuthorSuccess = createAction<CreateAuthorRequest>(
  "authors/createAuthorSuccess"
);
export const createAuthorFailure = createAction<string>(
  "authors/createAuthorFailure"
);

export const updateAuthorRequest = createAction<UpdateAuthorRequest>(
  "authors/updateAuthorRequest"
);
export const updateAuthorSuccess = createAction<UpdateAuthorRequest>(
  "authors/updateAuthorSuccess"
);
export const updateAuthorFailure = createAction<string>(
  "authors/updateAuthorFailure"
);

export const deleteAuthorRequest = createAction<number>(
  "authors/deleteAuthorRequest"
);
export const deleteAuthorSuccess = createAction<number>(
  "authors/deleteAuthorSuccess"
);
export const deleteAuthorFailure = createAction<string>(
  "authors/deleteAuthorFailure"
);

export const deleteBulkAuthorsRequest = createAction<number[]>(
  "Authors/deleteBulkAuthorsRequest"
);
export const deleteBulkAuthorsSuccess = createAction<number[]>(
  "Authors/deleteBulkAuthorsSuccess"
);
export const deleteBulkAuthorsFailure = createAction<string>(
  "Authors/deleteBulkAuthorsFailure"
);
