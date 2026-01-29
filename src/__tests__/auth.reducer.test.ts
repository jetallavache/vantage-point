import { describe, it, expect } from "vitest";
import { authReducer } from "../features/auth/model/reducer";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} from "../features/auth/model/actions";

describe("Auth reducer", () => {
  const initialState = {
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it("should handle loginRequest", () => {
    const action = loginRequest({
      email: "test@example.com",
      password: "password",
    });
    const state = authReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle loginSuccess", () => {
    const loadingState = { ...initialState, loading: true };
    const action = loginSuccess();
    const state = authReducer(loadingState, action);

    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle loginFailure", () => {
    const loadingState = { ...initialState, loading: true };
    const action = loginFailure("Login failed");
    const state = authReducer(loadingState, action);

    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe("Login failed");
  });

  it("should handle logout", () => {
    const authenticatedState = { ...initialState, isAuthenticated: true };
    const action = logout();
    const state = authReducer(authenticatedState, action);

    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe(null);
  });
});
