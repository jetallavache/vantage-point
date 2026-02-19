import { describe, it, expect } from "vitest";
import { tagsReducer } from "../features/tags/model/reducer";
import {
  fetchTagsSuccess,
  deleteTagSuccess,
  fetchTagsFailure,
} from "../features/tags/model/actions";

describe("Tags Reducer", () => {
  it("should handle fetchTagsSuccess", () => {
    const initialState = {
      items: [],
      currentTag: null,
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      total: 0,
      perPage: 9,
    };

    const action = fetchTagsSuccess({
      items: [{ id: 1, name: "Test Tag" }],
      currentPage: 1,
      totalPages: 1,
      total: 1,
      perPage: 9,
    });

    const newState = tagsReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].name).toBe("Test Tag");
  });

  it("should handle deleteTagSuccess", () => {
    const initialState = {
      items: [{ id: 1, name: "Test Tag" }],
      currentTag: null,
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      total: 1,
      perPage: 9,
    };

    const action = deleteTagSuccess(1);
    const newState = tagsReducer(initialState, action);
    expect(newState.items).toHaveLength(0);
    expect(newState.loading).toBe(false);
  });

  it("should handle fetchTagsFailure", () => {
    const initialState = {
      items: [],
      currentTag: null,
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      total: 0,
      perPage: 9,
    };

    const action = fetchTagsFailure("Error message");
    const newState = tagsReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe("Error message");
  });
});
