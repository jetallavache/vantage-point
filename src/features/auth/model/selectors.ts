import type { RootState } from "../../../shared";

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth?.isAuthenticated || false;
export const selectAuthLoading = (state: RootState) =>
  state.auth?.loading || false;
export const selectAuthError = (state: RootState) => state.auth?.error;
export const selectUserProfile = (state: RootState) => state.auth?.profile;
export const selectAuthValidationErrors = (state: RootState) =>
  state.auth?.validationErrors;
export const selectAuthFormError = (state: RootState) => state.auth?.formError;
export const selectAuthIsSubmitting = (state: RootState) =>
  state.auth?.isSubmitting || false;
