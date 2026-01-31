import type { RootState } from "../../../shared";
import { createSelector } from "@reduxjs/toolkit";

export const selectTags = (state: RootState) => state.tags;
export const selectTagsItems = (state: RootState) => state.tags?.items || [];
export const selectCurrentTag = (state: RootState) => state.tags?.currentTag;
export const selectTagsLoading = (state: RootState) =>
  state.tags?.loading || false;
export const selectTagsError = (state: RootState) => state.tags?.error;

export const selectTagsCurrentPage = createSelector(
  [selectTags],
  (tags) => tags?.currentPage || 1
);

export const selectTagsTotal = createSelector(
  [selectTags],
  (tags) => tags?.total || 0
);

export const selectTagsPageSize = createSelector(
  [selectTags],
  (tags) => tags?.perPage || 9
);

export const selectTagsPagination = createSelector(
  [selectTagsCurrentPage, selectTagsTotal, selectTagsPageSize],
  (current, total, pageSize) => ({
    current,
    total,
    pageSize,
  })
);
