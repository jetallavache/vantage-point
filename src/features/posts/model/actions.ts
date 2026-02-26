import { createAction } from "@reduxjs/toolkit";
import {
  CreatePostRequest,
  UpdatePostRequest,
  FetchPostsRequest,
} from "./types";
import { DomainError } from "../../../shared/api";

export const fetchPostsRequest = createAction<FetchPostsRequest>(
  "posts/fetchPostsRequest"
);
export const fetchPostsSuccess = createAction<{
  items: any[];
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}>("posts/fetchPostsSuccess");
export const fetchPostsFailure = createAction<string>(
  "posts/fetchPostsFailure"
);

export const fetchPostDetailRequest = createAction<number>(
  "posts/fetchPostDetailRequest"
);
export const fetchPostDetailSuccess = createAction<any>(
  "posts/fetchPostDetailSuccess"
);
export const fetchPostDetailFailure = createAction<string>(
  "posts/fetchPostDetailFailure"
);

export const createPostRequest = createAction<CreatePostRequest>(
  "posts/createPostRequest"
);
export const createPostSuccess = createAction("posts/createPostSuccess");
export const createPostFailure = createAction<DomainError>(
  "posts/createPostFailure"
);

export const updatePostRequest = createAction<UpdatePostRequest>(
  "posts/updatePostRequest"
);
export const updatePostSuccess = createAction("posts/updatePostSuccess");
export const updatePostFailure = createAction<DomainError>(
  "posts/updatePostFailure"
);

export const deletePostRequest = createAction<number>(
  "posts/deletePostRequest"
);
export const deletePostSuccess = createAction<number>(
  "posts/deletePostSuccess"
);
export const deletePostFailure = createAction<string>(
  "posts/deletePostFailure"
);

export const clearPostFormErrors = createAction("posts/clearPostFormErrors");
