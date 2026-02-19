import { describe, it, expect } from "vitest";
import { postsReducer } from "../features/posts/model/reducer";
import {
  fetchPostsSuccess,
  deletePostSuccess,
  fetchPostsFailure,
} from "../features/posts/model/actions";

describe("Posts Reducer", () => {
  it("should handle fetchPostsSuccess", () => {
    const initialState = {
      items: [],
      currentPost: null,
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 0,
      total: 0,
      perPage: 10,
    };

    const action = fetchPostsSuccess({
      items: [
        {
          id: 1,
          code: "123",
          title: "Test Post",
          text: "Test content",
          authorId: 1,
          tagIds: [1],
          previewPicture: null,
        },
      ],
      currentPage: 1,
      totalPages: 1,
      total: 1,
    });

    const newState = postsReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0].title).toBe("Test Post");
  });

  it("should handle deletePostSuccess", () => {
    const initialState = {
      items: [
        {
          id: 1,
          code: "123",
          title: "Test Post",
          text: "Test content",
          authorId: 1,
          tagIds: [1],
          previewPicture: null,
        },
      ],
      currentPost: null,
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      total: 1,
      perPage: 10,
    };

    const action = deletePostSuccess(1);
    const newState = postsReducer(initialState, action);
    expect(newState.items).toHaveLength(0);
    expect(newState.loading).toBe(false);
  });

  it("should handle fetchPostsFailure", () => {
    const initialState = {
      items: [],
      currentPost: null,
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 0,
      total: 0,
      perPage: 10,
    };

    const action = fetchPostsFailure("Error message");
    const newState = postsReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe("Error message");
  });
});
