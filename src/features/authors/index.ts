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
export { default as AuthorFormPage } from "./ui/AuthorFormPage";
export { default as AuthorDetailPage } from "./ui/AuthorDetailPage";
export { authorsApi } from "./api";
export * from "./model/types";
export * from "./model/actions";
export * from "./model/selectors";
