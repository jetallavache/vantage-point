import { call, put, takeEvery } from "redux-saga/effects";
import {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  fetchPostDetailRequest,
  fetchPostDetailSuccess,
  fetchPostDetailFailure,
  createPostRequest,
  createPostSuccess,
  createPostFailure,
  updatePostRequest,
  updatePostSuccess,
  updatePostFailure,
  deletePostRequest,
  deletePostSuccess,
  deletePostFailure,
} from "./actions";
import { postsApi } from "../api";
import { ApiException } from "../../../shared/api/errors";

function* fetchPostsSaga(
  action: ReturnType<typeof fetchPostsRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(postsApi.fetchPosts, action.payload.page);

    const headers = response.headers || {};
    const totalCount = parseInt(headers["x-pagination-total-count"] || "0", 10);
    const pageCount = parseInt(headers["x-pagination-page-count"] || "1", 10);
    const currentPage = parseInt(
      headers["x-pagination-current-page"] || "1",
      10
    );
    const itemsPerPage = parseInt(headers["x-pagination-per-page"] || "10", 10);

    yield put(
      fetchPostsSuccess({
        items: response.data || [],
        currentPage,
        totalPages: pageCount,
        total: totalCount,
        perPage: itemsPerPage,
      })
    );
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка загрузки постов";
    yield put(fetchPostsFailure(message));
  }
}

function* fetchPostDetailSaga(
  action: ReturnType<typeof fetchPostDetailRequest>
): Generator<any, void, any> {
  try {
    const response: any = yield call(postsApi.fetchPostDetail, action.payload);
    yield put(fetchPostDetailSuccess(response.data || response));
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка загрузки поста";
    yield put(fetchPostDetailFailure(message));
  }
}

function* createPostSaga(
  action: ReturnType<typeof createPostRequest>
): Generator<any, void, any> {
  try {
    yield call(postsApi.createPost, action.payload);
    yield put(createPostSuccess());
    window.location.href = "/vantage-point/posts";
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка создания поста";
    yield put(createPostFailure(message));
  }
}

function* updatePostSaga(
  action: ReturnType<typeof updatePostRequest>
): Generator<any, void, any> {
  try {
    yield call(postsApi.updatePost, action.payload);
    yield put(updatePostSuccess());
    window.location.href = "/vantage-point/posts";
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка обновления поста";
    yield put(updatePostFailure(message));
  }
}

function* deletePostSaga(
  action: ReturnType<typeof deletePostRequest>
): Generator<any, void, any> {
  try {
    yield call(postsApi.deletePost, action.payload);
    yield put(deletePostSuccess(action.payload));
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка удаления поста";
    yield put(deletePostFailure(message));
  }
}

export function* postsSaga(): Generator<any, void, any> {
  yield takeEvery(fetchPostsRequest.type, fetchPostsSaga);
  yield takeEvery(fetchPostDetailRequest.type, fetchPostDetailSaga);
  yield takeEvery(createPostRequest.type, createPostSaga);
  yield takeEvery(updatePostRequest.type, updatePostSaga);
  yield takeEvery(deletePostRequest.type, deletePostSaga);
}
