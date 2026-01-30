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
import { tokenStorage } from "../../../shared/api/token-storage";
import { ApiException } from "../../../shared/api/errors";
import { TokenResponse } from "./types";

function* loginSaga(
  action: ReturnType<typeof loginRequest>
): Generator<any, void, any> {
  try {
    const response: TokenResponse = yield call(authApi.login, action.payload);

    tokenStorage.setTokens(response.access_token, response.refresh_token);

    yield put(loginSuccess());
    // Используем обычную навигацию вместо connected-react-router
    window.location.href = "/vantage-point/";
  } catch (error) {
    const message =
      error instanceof ApiException ? error.message : "Ошибка входа";
    yield put(loginFailure(message));
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
