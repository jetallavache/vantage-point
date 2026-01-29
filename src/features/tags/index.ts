import { ISagaModule } from "redux-dynamic-modules-saga";
import { tagsReducer } from "./model/reducer";
import { tagsSaga } from "./model/saga";

export const tagsModule: ISagaModule<any> = {
  id: "tags",
  reducerMap: {
    tags: tagsReducer,
  },
  sagas: [tagsSaga],
};

export { default as TagsPage } from "./ui/TagsPage";
export * from "./model/types";
export * from "./model/actions";
export * from "./model/selectors";
