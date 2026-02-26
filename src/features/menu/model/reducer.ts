import { createReducer } from "@reduxjs/toolkit";
import { MenuState } from "./types";
import * as actions from "./actions";

const initialState: MenuState = {
  menuTypes: [],
  activeTypeId: null,
  tree: [],
  treeList: [],
  loading: false,
  dirty: false,
  error: null,
  isSubmitting: false,
};

export const menuReducer = createReducer(initialState, (builder) => {
  builder
    /* Menu Types */
    .addCase(actions.fetchMenuTypesRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.fetchMenuTypesSuccess, (state, action) => {
      state.loading = false;
      state.menuTypes = action.payload;
    })
    .addCase(actions.fetchMenuTypesFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(actions.addMenuTypeRequest, (state) => {
      state.isSubmitting = true;
      state.validationErrors = undefined;
      state.formError = undefined;
    })
    .addCase(actions.addMenuTypeSuccess, (state) => {
      state.isSubmitting = false;
    })
    .addCase(actions.addMenuTypeFailure, (state, action) => {
      state.isSubmitting = false;
      const error = action.payload;
      if (error.kind === "validation") {
        state.validationErrors = error.fields;
      } else if (error.kind === "form") {
        state.formError = error.message;
      } else {
        state.formError = error.message;
      }
    })

    .addCase(actions.editMenuTypeRequest, (state) => {
      state.isSubmitting = true;
      state.validationErrors = undefined;
      state.formError = undefined;
    })
    .addCase(actions.editMenuTypeSuccess, (state, action) => {
      state.isSubmitting = false;
      const index = state.menuTypes.findIndex(
        (type) => type.id === action.payload.id
      );
      if (index !== -1) {
        state.menuTypes[index] = action.payload;
      }
    })
    .addCase(actions.editMenuTypeFailure, (state, action) => {
      state.isSubmitting = false;
      const error = action.payload;
      if (error.kind === "validation") {
        state.validationErrors = error.fields;
      } else if (error.kind === "form") {
        state.formError = error.message;
      } else {
        state.formError = error.message;
      }
    })

    .addCase(actions.removeMenuTypeRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.removeMenuTypeSuccess, (state, action) => {
      state.loading = false;
      state.menuTypes = state.menuTypes.filter(
        (type) => type.id !== action.payload
      );
      if (state.activeTypeId === action.payload) {
        state.activeTypeId = null;
        state.tree = [];
        state.treeList = [];
      }
    })
    .addCase(actions.removeMenuTypeFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    /* Menu Items */
    .addCase(actions.fetchMenuTreeRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.fetchMenuTreeSuccess, (state, action) => {
      state.loading = false;
      state.tree = action.payload;
    })
    .addCase(actions.fetchMenuTreeFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(actions.fetchMenuTreeListRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.fetchMenuTreeListSuccess, (state, action) => {
      state.loading = false;
      state.treeList = action.payload;
      state.dirty = false;
    })
    .addCase(actions.fetchMenuTreeListFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(actions.addMenuItemRequest, (state) => {
      state.isSubmitting = true;
      state.validationErrors = undefined;
      state.formError = undefined;
    })
    .addCase(actions.addMenuItemSuccess, (state, action) => {
      state.isSubmitting = false;
      state.treeList.push(action.payload);
    })
    .addCase(actions.addMenuItemFailure, (state, action) => {
      state.isSubmitting = false;
      const error = action.payload;
      if (error.kind === "validation") {
        state.validationErrors = error.fields;
      } else if (error.kind === "form") {
        state.formError = error.message;
      } else {
        state.formError = error.message;
      }
    })

    .addCase(actions.editMenuItemRequest, (state) => {
      state.isSubmitting = true;
      state.validationErrors = undefined;
      state.formError = undefined;
    })
    .addCase(actions.editMenuItemSuccess, (state, action) => {
      state.isSubmitting = false;
      const index = state.treeList.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.treeList[index] = action.payload;
      }
    })
    .addCase(actions.editMenuItemFailure, (state, action) => {
      state.isSubmitting = false;
      const error = action.payload;
      if (error.kind === "validation") {
        state.validationErrors = error.fields;
      } else if (error.kind === "form") {
        state.formError = error.message;
      } else {
        state.formError = error.message;
      }
    })

    .addCase(actions.removeMenuItemRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.removeMenuItemSuccess, (state, action) => {
      state.loading = false;
      state.treeList = state.treeList.filter(
        (item) => item.id !== action.payload
      );
    })
    .addCase(actions.removeMenuItemFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    /* Drag & Drop */
    .addCase(actions.moveMenuItemRequest, (state, action) => {
      const { dragId, dropId, position } = action.payload;
      const dragIndex = state.treeList.findIndex((item) => item.id === dragId);
      const dropIndex = state.treeList.findIndex((item) => item.id === dropId);

      if (dragIndex === -1 || dropIndex === -1) return;

      const dragItem = { ...state.treeList[dragIndex] };
      const dropItem = state.treeList[dropIndex];

      if (position === "inside") {
        dragItem.parentId = dropId;
      } else {
        dragItem.parentId = dropItem.parentId;
      }

      /* Update sort orders */
      const siblings = state.treeList.filter(
        (item) => item.parentId === dragItem.parentId && item.id !== dragId
      );

      let newSort = 0;
      if (position === "before") {
        newSort = dropItem.sort;
        siblings.forEach((item) => {
          if (item.sort >= newSort) {
            const index = state.treeList.findIndex((i) => i.id === item.id);
            state.treeList[index].sort += 1;
          }
        });
      } else if (position === "after") {
        newSort = dropItem.sort + 1;
        siblings.forEach((item) => {
          if (item.sort > dropItem.sort) {
            const index = state.treeList.findIndex((i) => i.id === item.id);
            state.treeList[index].sort += 1;
          }
        });
      } else {
        newSort = Math.max(...siblings.map((s) => s.sort), 0) + 1;
      }

      dragItem.sort = newSort;
      state.treeList[dragIndex] = dragItem;
      state.dirty = true;
    })

    .addCase(actions.saveMenuStructureRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.saveMenuStructureSuccess, (state) => {
      state.loading = false;
      state.dirty = false;
    })
    .addCase(actions.saveMenuStructureFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    /* UI Actions */
    .addCase(actions.setActiveMenuType, (state, action) => {
      state.activeTypeId = action.payload;
    })
    .addCase(actions.setDirty, (state, action) => {
      state.dirty = action.payload;
    })
    .addCase(actions.clearMenuFormErrors, (state) => {
      state.validationErrors = undefined;
      state.formError = undefined;
    });
});
