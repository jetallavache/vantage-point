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
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  clearAuthFormErrors,
} from "./actions";
import { tokenStorage } from "../../../shared";

const initialState: AuthState = {
  isAuthenticated: !!tokenStorage.getAccessToken(),
  loading: false,
  error: null,
  profile: null,
  isSubmitting: false,
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginRequest, (state) => {
      state.isSubmitting = true;
      state.validationErrors = undefined;
      state.formError = undefined;
    })
    .addCase(loginSuccess, (state) => {
      state.isSubmitting = false;
      state.isAuthenticated = true;
    })
    .addCase(loginFailure, (state, action) => {
      state.isSubmitting = false;
      state.isAuthenticated = false;
      const error = action.payload;
      if (error.kind === "validation") {
        state.validationErrors = error.fields;
      } else if (error.kind === "form") {
        state.formError = error.message;
      } else {
        state.formError = error.message;
      }
    })
    .addCase(logout, (state) => {
      state.isAuthenticated = false;
      state.error = null;
      state.profile = null;
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
    })
    .addCase(fetchProfileRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchProfileSuccess, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    })
    .addCase(fetchProfileFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(clearAuthFormErrors, (state) => {
      state.validationErrors = undefined;
      state.formError = undefined;
    });
});
