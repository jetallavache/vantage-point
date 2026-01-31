import type { RootState } from "../../../shared";
import { createSelector } from "@reduxjs/toolkit";

export const selectAuthors = (state: RootState) => state.authors;
export const selectAuthorsItems = (state: RootState) =>
  state.authors?.items || [];
export const selectCurrentAuthor = (state: RootState) =>
  state.authors?.currentAuthor;
export const selectAuthorsLoading = (state: RootState) =>
  state.authors?.loading || false;
export const selectAuthorsError = (state: RootState) => state.authors?.error;

export const selectAuthorsCurrentPage = createSelector(
  [selectAuthors],
  (authors) => authors?.currentPage || 1
);

export const selectAuthorsTotal = createSelector(
  [selectAuthors],
  (authors) => authors?.total || 0
);

export const selectAuthorsPageSize = createSelector(
  [selectAuthors],
  (authors) => authors?.perPage || 9
);

export const selectAuthorsPagination = createSelector(
  [selectAuthorsCurrentPage, selectAuthorsTotal, selectAuthorsPageSize],
  (current, total, pageSize) => ({
    current,
    total,
    pageSize,
  })
);
