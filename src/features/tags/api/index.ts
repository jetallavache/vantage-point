import { apiClient } from "../../../shared";
import { CreateTagRequest, UpdateTagRequest } from "../model/types";

export const tagsApi = {
  fetchTags: (page: number = 1) => {
    return apiClient.getWithHeaders(`/manage/tags/default?page=${page}`);
  },

  fetchTagDetail: (id: number) => {
    return apiClient.get(`/manage/tags/detail?id=${id}`);
  },

  createTag: (data: CreateTagRequest) => {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("sort", data.sort.toString());
    return apiClient.post("/manage/tags/add", formData);
  },

  updateTag: (data: UpdateTagRequest) => {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("name", data.name);
    formData.append("sort", data.sort.toString());
    return apiClient.post(`/manage/tags/edit?id=${data.id}`, formData);
  },

  deleteTag: (id: number) => {
    return apiClient.delete(`/manage/tags/remove?id=${id}`);
  },

  bulkDeleteTags: (ids: number[]) => {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append("id", id.toString()));
    return apiClient.delete(
      `/manage/tags/multiple-remove?${params.toString()}`
    );
  },
};
