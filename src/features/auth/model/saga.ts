import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
} from "./actions";
import { authApi } from "../api";
import { tokenStorage } from "../../../shared";
import { showApiError } from "../../../shared/lib";
import { TokenResponse } from "./types";

function* loginSaga(
  action: ReturnType<typeof loginRequest>
): Generator<any, void, any> {
  try {
    const response: TokenResponse = yield call(authApi.login, action.payload);

    tokenStorage.setTokens(response.access_token, response.refresh_token);

    yield put(loginSuccess());

    window.location.href = "/vantage-point/";
  } catch (error) {
    yield call(showApiError, error);
    yield put(loginFailure("Ошибка входа"));
  }
}

function* refreshTokenSaga(): Generator<any, void, any> {
  try {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const response: TokenResponse = yield call(
      authApi.refreshToken,
      refreshToken
    );

    tokenStorage.setTokens(response.access_token, response.refresh_token);

    yield put(refreshTokenSuccess());
  } catch (error) {
    yield put(refreshTokenFailure());
    yield put(logout());
  }
}

function* logoutSaga(): Generator<any, void, any> {
  tokenStorage.clearTokens();
  window.location.href = "/vantage-point/";
}

export function* authSaga(): Generator<any, void, any> {
  yield takeEvery(loginRequest.type, loginSaga);
  yield takeLatest(refreshTokenRequest.type, refreshTokenSaga);
  yield takeEvery(logout.type, logoutSaga);
}
