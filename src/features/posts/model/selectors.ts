import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../shared";

export const selectPosts = (state: RootState) => state.posts;
export const selectPostsItems = (state: RootState) => state.posts?.items || [];
export const selectCurrentPost = (state: RootState) => state.posts?.currentPost;
export const selectPostsLoading = (state: RootState) =>
  state.posts?.loading || false;
export const selectPostsError = (state: RootState) => state.posts?.error;

export const selectPostsPagination = createSelector(
  [(state: RootState) => state.posts],
  (posts) => ({
    current: posts?.currentPage || 1,
    total: posts?.total || 0,
    pageSize: posts?.perPage || 10,
  })
);

export const selectPostsTotal = (state: RootState) => state.posts?.total || 0;

export const selectPostValidationErrors = (state: RootState) =>
  state.posts?.validationErrors;
export const selectPostFormError = (state: RootState) => state.posts?.formError;
export const selectPostIsSubmitting = (state: RootState) =>
  state.posts?.isSubmitting || false;
