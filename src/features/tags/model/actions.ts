import { createAction } from "@reduxjs/toolkit";
import {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  FetchTagsRequest,
  FetchTagsSuccess,
} from "./types";
import { DomainError } from "../../../shared/api";

export const fetchTagsRequest = createAction<FetchTagsRequest>(
  "tags/fetchTagsRequest"
);
export const fetchTagsSuccess = createAction<FetchTagsSuccess>(
  "tags/fetchTagsSuccess"
);
export const fetchTagsFailure = createAction<string>("tags/fetchTagsFailure");

export const fetchTagDetailRequest = createAction<number>(
  "tags/fetchTagDetailRequest"
);
export const fetchTagDetailSuccess = createAction<any>(
  "tags/fetchTagDetailSuccess"
);
export const fetchTagDetailFailure = createAction<string>(
  "tags/fetchTagDetailFailure"
);

export const createTagRequest = createAction<CreateTagRequest>(
  "tags/createTagRequest"
);
export const createTagSuccess = createAction<Tag>("tags/createTagSuccess");
export const createTagFailure = createAction<DomainError>(
  "tags/createTagFailure"
);

export const updateTagRequest = createAction<UpdateTagRequest>(
  "tags/updateTagRequest"
);
export const updateTagSuccess = createAction<Tag>("tags/updateTagSuccess");
export const updateTagFailure = createAction<DomainError>(
  "tags/updateTagFailure"
);

export const deleteTagRequest = createAction<number>("tags/deleteTagRequest");
export const deleteTagSuccess = createAction<number>("tags/deleteTagSuccess");
export const deleteTagFailure = createAction<string>("tags/deleteTagFailure");

export const deleteBulkTagsRequest = createAction<number[]>(
  "tags/deleteBulkTagsRequest"
);
export const deleteBulkTagsSuccess = createAction<number[]>(
  "tags/deleteBulkTagsSuccess"
);
export const deleteBulkTagsFailure = createAction<string>(
  "tags/deleteBulkTagsFailure"
);

export const clearTagFormErrors = createAction("tags/clearTagFormErrors");
