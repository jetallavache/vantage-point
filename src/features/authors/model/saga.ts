import { call, put, takeEvery } from "redux-saga/effects";
import {
  fetchAuthorsRequest,
  fetchAuthorsSuccess,
  fetchAuthorsFailure,
  fetchAuthorDetailRequest,
  fetchAuthorDetailSuccess,
  fetchAuthorDetailFailure,
  createAuthorRequest,
  createAuthorSuccess,
  createAuthorFailure,
  updateAuthorRequest,
  updateAuthorSuccess,
  updateAuthorFailure,
  deleteAuthorRequest,
  deleteAuthorSuccess,
  deleteAuthorFailure,
  deleteBulkAuthorsRequest,
  deleteBulkAuthorsSuccess,
  deleteBulkAuthorsFailure,
} from "./actions";
import { authorsApi } from "../api";
import { ApiException } from "../../../shared";

function* fetchAuthorsSaga(
  action: ReturnType<typeof fetchAuthorsRequest>
): Generator<any, void, any> {
  try {
    const { page } = action.payload;

    const response: any = yield call(authorsApi.fetchAuthors, page);

    const headers = response.headers || {};

    const totalCount = parseInt(headers["x-pagination-total-count"] || "0", 10);
    const pageCount = parseInt(headers["x-pagination-page-count"] || "1", 10);
    const currentPage = parseInt(
      headers["x-pagination-current-page"] || "1",
      10
    );
    const itemsPerPage = parseInt(headers["x-pagination-per-page"] || "9", 10);

    yield put(
      fetchAuthorsSuccess({
        items: response.data || [],
        currentPage,
        totalPages: pageCount,
        total: totalCount,
        perPage: itemsPerPage,
      })
    );
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка загрузки авторов";
    yield put(fetchAuthorsFailure(message));
  }
}

function* fetchAuthorDetailSaga(
  action: ReturnType<typeof fetchAuthorDetailRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(
      authorsApi.fetchAuthorDetail,
      action.payload
    );
    yield put(fetchAuthorDetailSuccess(response.data || response));
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка загрузки автора";
    yield put(fetchAuthorDetailFailure(message));
  }
}

function* createAuthorSaga(
  action: ReturnType<typeof createAuthorRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(authorsApi.createAuthor, action.payload);
    yield put(createAuthorSuccess(response));
    const { message } = yield import("antd");
    message.success("Автор создан");
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка создания автора";
    yield put(createAuthorFailure(message));
  }
}

function* updateAuthorSaga(
  action: ReturnType<typeof updateAuthorRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(authorsApi.updateAuthor, action.payload);
    yield put(updateAuthorSuccess(response));
    const { message } = yield import("antd");
    message.success("Автор обновлен");
  } catch (error) {
    const message =
      error instanceof ApiException
        ? error.message
        : "Ошибка обновления автора";
    yield put(updateAuthorFailure(message));
  }
}

function* deleteAuthorSaga(
  action: ReturnType<typeof deleteAuthorRequest>
): Generator<any, void, any> {
  try {
    yield call(authorsApi.deleteAuthor, action.payload);
    yield put(deleteAuthorSuccess(action.payload));
    const { message } = yield import("antd");
    message.success("Автор удален");
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка удаления автора";
    yield put(deleteAuthorFailure(message));
  }
}

function* bulkDeleteAuthorsSaga(
  action: ReturnType<typeof deleteBulkAuthorsRequest>
): Generator<any, void, any> {
  try {
    yield call(authorsApi.bulkDeleteAuthors, action.payload);
    yield put(deleteBulkAuthorsSuccess(action.payload));
    const { message } = yield import("antd");
    message.success(`Авторы: ${action.payload.toLocaleString()} удалены`);
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка удаления авторов";
    yield put(deleteBulkAuthorsFailure(message));
  }
}

export function* authorsSaga(): Generator<any, void, any> {
  yield takeEvery(fetchAuthorsRequest.type, fetchAuthorsSaga);
  yield takeEvery(fetchAuthorDetailRequest.type, fetchAuthorDetailSaga);
  yield takeEvery(createAuthorRequest.type, createAuthorSaga);
  yield takeEvery(updateAuthorRequest.type, updateAuthorSaga);
  yield takeEvery(deleteAuthorRequest.type, deleteAuthorSaga);
  yield takeEvery(deleteBulkAuthorsRequest.type, bulkDeleteAuthorsSaga);
}
