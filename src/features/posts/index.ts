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
