export interface Post {
  id: number;
  code: string;
  title: string;
  text: string;
  authorId?: number;
  authorName?: string;
  author?: {
    id: number;
    fullName: string;
    avatar?: {
      id: number;
      name: string;
      url: string;
    };
  };
  tagIds?: number[];
  tags?: Array<{
    id: number;
    name: string;
    color?: string;
  }>;
  previewPicture?: {
    id: number;
    name: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PostsState {
  items: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
}

export interface CreatePostRequest {
  code: string;
  title: string;
  text: string;
  authorId: number;
  tagIds: number[];
  previewPicture?: File;
}

export interface UpdatePostRequest extends CreatePostRequest {
  id: number;
}

export interface FetchPostsRequest {
  page: number;
}
