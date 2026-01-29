import { ISagaModule } from "redux-dynamic-modules-saga";
import { authorsReducer } from "./model/reducer";
import { authorsSaga } from "./model/saga";

export const authorsModule: ISagaModule<any> = {
  id: "authors",
  reducerMap: {
    authors: authorsReducer,
  },
  sagas: [authorsSaga],
};

export { default as AuthorsPage } from "./ui/AuthorsPage";
export * from "./model/types";
export * from "./model/actions";
export * from "./model/selectors";
