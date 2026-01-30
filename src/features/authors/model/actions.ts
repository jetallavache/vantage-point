import { createAction } from "@reduxjs/toolkit";
import {
  Author,
  CreateAuthorRequest,
  UpdateAuthorRequest,
  FetchAuthorsRequest,
} from "./types";

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
export const createAuthorSuccess = createAction<Author>(
  "authors/createAuthorSuccess"
);
export const createAuthorFailure = createAction<string>(
  "authors/createAuthorFailure"
);

export const updateAuthorRequest = createAction<UpdateAuthorRequest>(
  "authors/updateAuthorRequest"
);
export const updateAuthorSuccess = createAction<Author>(
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
