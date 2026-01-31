import { ISagaModule } from "redux-dynamic-modules-saga";
import { postsReducer } from "./model/reducer";
import { postsSaga } from "./model/saga";

export const postsModule: ISagaModule<any> = {
  id: "posts",
  reducerMap: {
    posts: postsReducer,
  },
  sagas: [postsSaga],
};

export { default as PostsPage } from "./ui/PostsPage";
export { default as PostDetailPage } from "./ui/PostDetailPage";
export { default as PostFormPage } from "./ui/PostFormPage";
export { postsApi } from "./api";
export * from "./model/types";
export * from "./model/actions";
export * from "./model/selectors";
