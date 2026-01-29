import { createReducer } from "@reduxjs/toolkit";
import { AuthState } from "./types";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
} from "./actions";
import { tokenStorage } from "../../../shared/api/token-storage";

const initialState: AuthState = {
  isAuthenticated: !!tokenStorage.getAccessToken(),
  loading: false,
  error: null,
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginSuccess, (state) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
    })
    .addCase(loginFailure, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    })
    .addCase(logout, (state) => {
      state.isAuthenticated = false;
      state.error = null;
    })
    .addCase(refreshTokenRequest, (state) => {
      state.loading = true;
    })
    .addCase(refreshTokenSuccess, (state) => {
      state.loading = false;
      state.isAuthenticated = true;
    })
    .addCase(refreshTokenFailure, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    });
});
