export interface Author {
  updatedAt: number;
  createdAt: number;
  id: number;
  name: string;
  lastName: string;
  secondName?: string;
  shortDescription?: string;
  description?: string;
  avatar?: {
    id: number;
    name: string;
    url: string;
  };
}

export interface AuthorsState {
  items: Author[];
  currentAuthor: Author | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  validationErrors?: Record<string, string>;
  formError?: string;
  isSubmitting: boolean;
}

export interface CreateAuthorRequest {
  name: string;
  lastName: string;
  secondName?: string;
  shortDescription?: string;
  description?: string;
  avatar?: File;
  removeAvatar?: boolean;
}

export interface UpdateAuthorRequest extends CreateAuthorRequest {
  id: number;
}

export interface FetchAuthorsRequest {
  page: number;
}

export interface FetchAuthorsSuccess {
  items: Author[];
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}
