import { call, put, takeEvery, select } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { menuApi } from "../api";
import * as actions from "./actions";
import { showApiError } from "../../../shared/lib";
import {
  CreateMenuTypeRequest,
  UpdateMenuTypeRequest,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from "./types";

function* fetchMenuTypesSaga(): Generator<any, void, any> {
  try {
    const response: any = yield call(menuApi.fetchMenuTypes);
    yield put(actions.fetchMenuTypesSuccess(response));
  } catch (error: any) {
    yield call(showApiError, error);
    yield put(actions.fetchMenuTypesFailure(error.message));
  }
}

function* addMenuTypeSaga(
  action: PayloadAction<CreateMenuTypeRequest>
): Generator<any, void, any> {
  try {
    yield call(menuApi.addMenuType, action.payload);
    yield put(actions.fetchMenuTypesRequest());
    yield put(actions.setActiveMenuType(action.payload.id));
  } catch (error: any) {
    yield call(showApiError, error);
    yield put(actions.addMenuTypeFailure(error.message));
  }
}

function* editMenuTypeSaga(
  action: PayloadAction<UpdateMenuTypeRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(menuApi.editMenuType, action.payload);
    yield put(actions.editMenuTypeSuccess(response));
  } catch (error: any) {
    yield call(showApiError, error);
    yield put(actions.editMenuTypeFailure(error.message));
  }
}

function* removeMenuTypeSaga(
  action: PayloadAction<string>
): Generator<any, void, any> {
  try {
    yield call(menuApi.removeMenuType, action.payload);
    yield put(actions.removeMenuTypeSuccess(action.payload));
  } catch (error: any) {
    yield call(showApiError, error);
    yield put(actions.removeMenuTypeFailure(error.message));
  }
}

function* fetchMenuTreeSaga(
  action: PayloadAction<string>
): Generator<any, void, any> {
  try {
    const response: any = yield call(menuApi.fetchMenuTree, action.payload);
    yield put(actions.fetchMenuTreeSuccess(response.data));
  } catch (error: any) {
    yield call(showApiError, error);
    yield put(actions.fetchMenuTreeFailure(error.message));
  }
}

function* fetchMenuTreeListSaga(
  action: PayloadAction<string>
): Generator<any, void, any> {
  try {
    const response: any = yield call(menuApi.fetchMenuTreeList, action.payload);
    yield put(actions.fetchMenuTreeListSuccess(response.data));
  } catch (error: any) {
    yield call(showApiError, error);
    yield put(actions.fetchMenuTreeListFailure(error.message));
  }
}

function* addMenuItemSaga(
  action: PayloadAction<CreateMenuItemRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(menuApi.addMenuItem, action.payload);
    yield put(actions.addMenuItemSuccess(response.data));
  } catch (error: any) {
    yield call(showApiError, error);
    yield put(actions.addMenuItemFailure(error.message));
  }
}

function* editMenuItemSaga(
  action: PayloadAction<UpdateMenuItemRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(menuApi.editMenuItem, action.payload);
    yield put(actions.editMenuItemSuccess(response.data));
  } catch (error: any) {
    yield call(showApiError, error);
    yield put(actions.editMenuItemFailure(error.message));
  }
}

function* removeMenuItemSaga(
  action: PayloadAction<string>
): Generator<any, void, any> {
  try {
    const state: any = yield select();
    const activeTypeId = state.menu.activeTypeId;

    if (!activeTypeId) {
      throw new Error("No active menu type");
    }

    yield call(menuApi.removeMenuItem, activeTypeId, action.payload);
    yield put(actions.removeMenuItemSuccess(action.payload));
  } catch (error: any) {
    yield call(showApiError, error);
    yield put(actions.removeMenuItemFailure(error.message));
  }
}

export function* menuSaga() {
  yield takeEvery(actions.fetchMenuTypesRequest.type, fetchMenuTypesSaga);
  yield takeEvery(actions.addMenuTypeRequest.type, addMenuTypeSaga);
  yield takeEvery(actions.editMenuTypeRequest.type, editMenuTypeSaga);
  yield takeEvery(actions.removeMenuTypeRequest.type, removeMenuTypeSaga);

  yield takeEvery(actions.fetchMenuTreeRequest.type, fetchMenuTreeSaga);
  yield takeEvery(actions.fetchMenuTreeListRequest.type, fetchMenuTreeListSaga);
  yield takeEvery(actions.addMenuItemRequest.type, addMenuItemSaga);
  yield takeEvery(actions.editMenuItemRequest.type, editMenuItemSaga);
  yield takeEvery(actions.removeMenuItemRequest.type, removeMenuItemSaga);
}
