import type { RootState } from "../../../shared";

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth?.isAuthenticated || false;
export const selectAuthLoading = (state: RootState) =>
  state.auth?.loading || false;
export const selectAuthError = (state: RootState) => state.auth?.error;
