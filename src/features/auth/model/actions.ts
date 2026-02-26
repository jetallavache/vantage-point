import { createAction } from "@reduxjs/toolkit";
import { LoginRequest, UserProfile } from "./types";
import { DomainError } from "../../../shared/api";

export const loginRequest = createAction<LoginRequest>("auth/loginRequest");
export const loginSuccess = createAction("auth/loginSuccess");
export const loginFailure = createAction<DomainError>("auth/loginFailure");
export const logout = createAction("auth/logout");
export const refreshTokenRequest = createAction("auth/refreshTokenRequest");
export const refreshTokenSuccess = createAction("auth/refreshTokenSuccess");
export const refreshTokenFailure = createAction("auth/refreshTokenFailure");
export const fetchProfileRequest = createAction("auth/fetchProfileRequest");
export const fetchProfileSuccess = createAction<UserProfile>(
  "auth/fetchProfileSuccess"
);
export const fetchProfileFailure = createAction<string>(
  "auth/fetchProfileFailure"
);
export const clearAuthFormErrors = createAction("auth/clearAuthFormErrors");
