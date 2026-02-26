import { describe, it, expect } from "vitest";
import { menuReducer } from "../features/menu/model/reducer";
import {
  fetchMenuTypesSuccess,
  addMenuTypeSuccess,
  fetchMenuTypesFailure,
} from "../features/menu/model/actions";

describe("Menu Reducer", () => {
  it("should handle fetchMenuTypesSuccess", () => {
    const initialState = {
      menuTypes: [],
      activeTypeId: null,
      tree: [],
      treeList: [],
      loading: true,
      dirty: false,
      error: null,
    };

    const action = fetchMenuTypesSuccess([{ id: "main", name: "Main Menu" }]);

    const newState = menuReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.menuTypes).toHaveLength(1);
    expect(newState.menuTypes[0].name).toBe("Main Menu");
  });

  it("should handle addMenuTypeSuccess", () => {
    const initialState = {
      menuTypes: [],
      activeTypeId: null,
      tree: [],
      treeList: [],
      loading: true,
      dirty: false,
      error: null,
      isSubmitting: true,
    };

    const action = addMenuTypeSuccess({
      id: "footer",
      name: "Footer Menu",
      createdAt: "",
      updatedAt: "",
    });
    const newState = menuReducer(initialState, action);
    expect(newState.isSubmitting).toBe(false);
    expect(newState.menuTypes).toHaveLength(0); // Не добавляется, т.к. это делает fetchMenuTypesSuccess
  });

  it("should handle fetchMenuTypesFailure", () => {
    const initialState = {
      menuTypes: [],
      activeTypeId: null,
      tree: [],
      treeList: [],
      loading: true,
      dirty: false,
      error: null,
    };

    const action = fetchMenuTypesFailure("Error message");
    const newState = menuReducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe("Error message");
  });
});
