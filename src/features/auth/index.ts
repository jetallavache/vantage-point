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

export { LoginPage } from "./ui/LoginPage";
export { authApi } from "./api";
export * from "./model/types";
export * from "./model/actions";
export * from "./model/selectors";
