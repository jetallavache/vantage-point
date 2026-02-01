import { call, put, takeEvery } from "redux-saga/effects";
import {
  fetchTagsRequest,
  fetchTagsSuccess,
  fetchTagsFailure,
  fetchTagDetailRequest,
  fetchTagDetailSuccess,
  fetchTagDetailFailure,
  createTagRequest,
  createTagSuccess,
  createTagFailure,
  updateTagRequest,
  updateTagSuccess,
  updateTagFailure,
  deleteTagRequest,
  deleteTagSuccess,
  deleteTagFailure,
  deleteBulkTagsRequest,
  deleteBulkTagsSuccess,
  deleteBulkTagsFailure,
} from "./actions";
import { tagsApi } from "../api";
import { ApiException } from "../../../shared";

function* fetchTagsSaga(
  action: ReturnType<typeof fetchTagsRequest>
): Generator<any, void, any> {
  try {
    const { page } = action.payload;

    const response: any = yield call(tagsApi.fetchTags, page);

    const headers = response.headers || {};

    const totalCount = parseInt(headers["x-pagination-total-count"] || "0", 10);
    const pageCount = parseInt(headers["x-pagination-page-count"] || "1", 10);
    const currentPage = parseInt(
      headers["x-pagination-current-page"] || "1",
      10
    );
    const itemsPerPage = parseInt(headers["x-pagination-per-page"] || "9", 10);

    yield put(
      fetchTagsSuccess({
        items: response.data || [],
        currentPage,
        totalPages: pageCount,
        total: totalCount,
        perPage: itemsPerPage,
      })
    );
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка загрузки тегов";
    yield put(fetchTagsFailure(message));
  }
}

function* fetchTagDetailSaga(
  action: ReturnType<typeof fetchTagDetailRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(tagsApi.fetchTagDetail, action.payload);
    yield put(fetchTagDetailSuccess(response.data || response));
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка загрузки тега";
    yield put(fetchTagDetailFailure(message));
  }
}

function* createTagSaga(
  action: ReturnType<typeof createTagRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(tagsApi.createTag, action.payload);
    yield put(createTagSuccess(response));
    const { message } = yield import("antd");
    message.success("Тег создан");
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка создания тега";
    yield put(createTagFailure(message));
  }
}

function* updateTagSaga(
  action: ReturnType<typeof updateTagRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(tagsApi.updateTag, action.payload);
    yield put(updateTagSuccess(response));
    const { message } = yield import("antd");
    message.success("Тег обновлен");
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка обновления тега";
    yield put(updateTagFailure(message));
  }
}

function* deleteTagSaga(
  action: ReturnType<typeof deleteTagRequest>
): Generator<any, void, any> {
  try {
    yield call(tagsApi.deleteTag, action.payload);
    yield put(deleteTagSuccess(action.payload));
    const { message } = yield import("antd");
    message.success("Тег удален");
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка удаления тега";
    yield put(deleteTagFailure(message));
  }
}

function* bulkDeleteTagsSaga(
  action: ReturnType<typeof deleteBulkTagsRequest>
): Generator<any, void, any> {
  try {
    yield call(tagsApi.bulkDeleteTags, action.payload);
    yield put(deleteBulkTagsSuccess(action.payload));
    const { message } = yield import("antd");
    message.success(`Теги: ${action.payload.toLocaleString()} удалены`);
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка удаления тегов";
    yield put(deleteBulkTagsFailure(message));
  }
}

export function* tagsSaga(): Generator<any, void, any> {
  yield takeEvery(fetchTagsRequest.type, fetchTagsSaga);
  yield takeEvery(fetchTagDetailRequest.type, fetchTagDetailSaga);
  yield takeEvery(createTagRequest.type, createTagSaga);
  yield takeEvery(updateTagRequest.type, updateTagSaga);
  yield takeEvery(deleteTagRequest.type, deleteTagSaga);
  yield takeEvery(deleteBulkTagsRequest.type, bulkDeleteTagsSaga);
}
