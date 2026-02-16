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
import { showApiError } from "../../../shared/lib";
import { Tag } from "./types";

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
    const itemsPerPage = parseInt(headers["x-pagination-per-page"] || "10", 10);

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
    yield call(showApiError, error);
    yield put(fetchTagsFailure("Ошибка загрузки тегов"));
  }
}

function* fetchTagDetailSaga(
  action: ReturnType<typeof fetchTagDetailRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(tagsApi.fetchTagDetail, action.payload);
    yield put(fetchTagDetailSuccess(response.data || response));
  } catch (error) {
    yield call(showApiError, error);
    yield put(fetchTagDetailFailure("Ошибка загрузки тега"));
  }
}

function* createTagSaga(
  action: ReturnType<typeof createTagRequest>
): Generator<any, void, any> {
  try {
    yield call(tagsApi.createTag, action.payload);
    const t: Tag = {
      id: 0,
      createdAt: "",
      updatedAt: "",
      ...action.payload,
    };
    yield put(createTagSuccess(t));
    window.location.href = "/vantage-point/tags";
  } catch (error) {
    yield call(showApiError, error);
    yield put(createTagFailure("Ошибка создания тега"));
  }
}

function* updateTagSaga(
  action: ReturnType<typeof updateTagRequest>
): Generator<any, void, any> {
  try {
    yield call(tagsApi.updateTag, action.payload);
    const t: Tag = {
      createdAt: "",
      updatedAt: "",
      ...action.payload,
    };
    yield put(updateTagSuccess(t));
    window.location.href = "/vantage-point/tags";
  } catch (error) {
    yield call(showApiError, error);
    yield put(updateTagFailure("Ошибка обновления тега"));
  }
}

function* deleteTagSaga(
  action: ReturnType<typeof deleteTagRequest>
): Generator<any, void, any> {
  try {
    yield call(tagsApi.deleteTag, action.payload);
    yield put(deleteTagSuccess(action.payload));
  } catch (error) {
    yield call(showApiError, error);
    yield put(deleteTagFailure("Ошибка удаления тега"));
  }
}

function* deleteBulkTagsSaga(
  action: ReturnType<typeof deleteBulkTagsRequest>
): Generator<any, void, any> {
  try {
    yield call(tagsApi.bulkDeleteTags, action.payload);
    yield put(deleteBulkTagsSuccess(action.payload));
  } catch (error) {
    yield call(showApiError, error);
    yield put(deleteBulkTagsFailure("Ошибка массового удаления тегов"));
  }
}

export function* tagsSaga(): Generator<any, void, any> {
  yield takeEvery(fetchTagsRequest.type, fetchTagsSaga);
  yield takeEvery(fetchTagDetailRequest.type, fetchTagDetailSaga);
  yield takeEvery(createTagRequest.type, createTagSaga);
  yield takeEvery(updateTagRequest.type, updateTagSaga);
  yield takeEvery(deleteTagRequest.type, deleteTagSaga);
  yield takeEvery(deleteBulkTagsRequest.type, deleteBulkTagsSaga);
}
