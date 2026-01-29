import { createBrowserHistory } from "history";
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import { authReducer } from "../../features/auth/model/reducer";
import { postsReducer } from "../../features/posts/model/reducer";
import { authorsReducer } from "../../features/authors/model/reducer";
import { tagsReducer } from "../../features/tags/model/reducer";
import { authSaga } from "../../features/auth/model/saga";
import { postsSaga } from "../../features/posts/model/saga";
import { authorsSaga } from "../../features/authors/model/saga";
import { tagsSaga } from "../../features/tags/model/saga";

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

function* rootSaga(): Generator<any, void, any> {
  yield all([authSaga(), postsSaga(), authorsSaga(), tagsSaga()]);
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    authors: authorsReducer,
    tags: tagsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["@@router/LOCATION_CHANGE"],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
