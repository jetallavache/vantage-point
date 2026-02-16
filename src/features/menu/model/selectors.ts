import { RootState } from "../../../shared/store";

export const selectMenuTypes = (state: RootState) =>
  state.menu?.menuTypes || [];
export const selectActiveTypeId = (state: RootState) =>
  state.menu?.activeTypeId || null;
export const selectMenuTree = (state: RootState) => state.menu?.tree || [];
export const selectMenuTreeList = (state: RootState) =>
  state.menu?.treeList || [];
export const selectMenuLoading = (state: RootState) =>
  state.menu?.loading || false;
export const selectMenuDirty = (state: RootState) => state.menu?.dirty || false;
export const selectMenuError = (state: RootState) => state.menu?.error || null;
