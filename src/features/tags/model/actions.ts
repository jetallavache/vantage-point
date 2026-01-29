import { createAction } from "@reduxjs/toolkit";
import {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  FetchTagsRequest,
} from "./types";

// Fetch tags
export const fetchTagsRequest = createAction<FetchTagsRequest>(
  "tags/fetchTagsRequest"
);
export const fetchTagsSuccess = createAction<{
  items: Tag[];
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}>("tags/fetchTagsSuccess");
export const fetchTagsFailure = createAction<string>("tags/fetchTagsFailure");

// Fetch tag detail
export const fetchTagDetailRequest = createAction<number>(
  "tags/fetchTagDetailRequest"
);
export const fetchTagDetailSuccess = createAction<any>(
  "tags/fetchTagDetailSuccess"
);
export const fetchTagDetailFailure = createAction<string>(
  "tags/fetchTagDetailFailure"
);

// Create tag
export const createTagRequest = createAction<CreateTagRequest>(
  "tags/createTagRequest"
);
export const createTagSuccess = createAction<Tag>("tags/createTagSuccess");
export const createTagFailure = createAction<string>("tags/createTagFailure");

// Update tag
export const updateTagRequest = createAction<UpdateTagRequest>(
  "tags/updateTagRequest"
);
export const updateTagSuccess = createAction<Tag>("tags/updateTagSuccess");
export const updateTagFailure = createAction<string>("tags/updateTagFailure");

// Delete tag
export const deleteTagRequest = createAction<number>("tags/deleteTagRequest");
export const deleteTagSuccess = createAction<number>("tags/deleteTagSuccess");
export const deleteTagFailure = createAction<string>("tags/deleteTagFailure");
