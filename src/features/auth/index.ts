import { ISagaModule } from "redux-dynamic-modules-saga";
import { authReducer } from "./model/reducer";
import { authSaga } from "./model/saga";

export const authModule: ISagaModule<any> = {
  id: "auth",
  reducerMap: {
    auth: authReducer,
  },
  sagas: [authSaga],
};
