import { apiClient } from "../../../shared";
import { CreatePostRequest, UpdatePostRequest } from "../model/types";

export const postsApi = {
  fetchPosts: (page: number = 1) => {
    return apiClient.getWithHeaders(`/manage/posts/default?page=${page}`);
  },

  fetchPostDetail: (id: number) => {
    return apiClient.get(`/manage/posts/detail?id=${id}`);
  },

  createPost: (data: CreatePostRequest) => {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("authorId", data.authorId.toString());

    data.tagIds.forEach((tagId) => {
      formData.append("tagIds[]", tagId.toString());
    });

    if (data.previewPicture) {
      formData.append("previewPicture", data.previewPicture);
    }

    return apiClient.post("/manage/posts/add", formData);
  },

  updatePost: (data: UpdatePostRequest) => {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("authorId", data.authorId.toString());

    data.tagIds.forEach((tagId) => {
      formData.append("tagIds[]", tagId.toString());
    });

    if (data.previewPicture) {
      formData.append("previewPicture", data.previewPicture);
    }

    return apiClient.post(`/manage/posts/edit?id=${data.id}`, formData);
  },

  deletePost: (id: number) => {
    return apiClient.delete(`/manage/posts/remove?id=${id}`);
  },
};
