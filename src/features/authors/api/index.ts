import { apiClient } from "../../../shared";
import { CreateAuthorRequest, UpdateAuthorRequest } from "../model/types";

export const authorsApi = {
  fetchAuthors: (page: number = 1) => {
    return apiClient.getWithHeaders(`/manage/authors/default?page=${page}`);
  },

  fetchAuthorDetail: (id: number) => {
    return apiClient.get(`/manage/authors/detail?id=${id}`);
  },

  createAuthor: (data: CreateAuthorRequest) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("lastName", data.lastName);
    if (data.secondName) {
      formData.append("secondName", data.secondName);
    }
    if (data.shortDescription) {
      formData.append("shortDescription", data.shortDescription);
    }
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    if (data.removeAvatar) {
      formData.append("removeAvatar", "true");
    }
    return apiClient.post("/manage/authors/add", formData);
  },

  updateAuthor: (data: UpdateAuthorRequest) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("lastName", data.lastName);
    if (data.secondName) {
      formData.append("secondName", data.secondName);
    }
    if (data.shortDescription) {
      formData.append("shortDescription", data.shortDescription);
    }
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    if (data.removeAvatar) {
      formData.append("removeAvatar", "1");
    }
    return apiClient.post(`/manage/authors/edit?id=${data.id}`, formData);
  },

  deleteAuthor: (id: number) => {
    return apiClient.delete(`/manage/authors/remove?id=${id}`);
  },

  bulkDeleteAuthors: (ids: number[]) => {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("id", id.toString()));
    return apiClient.delete(
      `/manage/authors/multiple-remove?${params.toString()}`
    );
  },
};
