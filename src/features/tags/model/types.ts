export interface Tag {
  id: number;
  code: string;
  name: string;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface TagsState {
  items: Tag[];
  currentTag: Tag | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}

export interface CreateTagRequest {
  code: string;
  name: string;
  sort: number;
}

export interface UpdateTagRequest extends CreateTagRequest {
  id: number;
}

export interface FetchTagsRequest {
  page: number;
}
