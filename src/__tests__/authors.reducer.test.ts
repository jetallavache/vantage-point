import { describe, it, expect } from "vitest";
import { authorsReducer } from "../features/authors/model/reducer";
import {
  fetchAuthorsRequest,
  fetchAuthorsSuccess,
  fetchAuthorsFailure,
} from "../features/authors/model/actions";

describe("Authors reducer", () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    total: 0,
    perPage: 9,
  };

  it("should handle fetchAuthorsRequest", () => {
    const action = fetchAuthorsRequest({ page: 1 });
    const state = authorsReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it("should handle fetchAuthorsSuccess", () => {
    const loadingState = { ...initialState, loading: true };
    const action = fetchAuthorsSuccess({
      items: [{ id: 1, fullName: "Test Author" }],
      currentPage: 1,
      totalPages: 1,
      total: 1,
      perPage: 9,
    });
    const state = authorsReducer(loadingState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].fullName).toBe("Test Author");
    expect(state.error).toBe(null);
  });

  it("should handle fetchAuthorsFailure", () => {
    const loadingState = { ...initialState, loading: true };
    const action = fetchAuthorsFailure("Load failed");
    const state = authorsReducer(loadingState, action);

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(0);
    expect(state.error).toBe("Load failed");
  });
});
