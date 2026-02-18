export interface Post {
  id: number;
  code: string;
  title: string;
  authorName?: string;
  tagNames?: Array<string>;
  previewPicture?: {
    id: number;
    name: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type TagItem = {
  id: number;
  name: string;
  code: string;
};

export interface FetchPostDetailRequest {
  id: number;
  title: string;
  code: string;
  text: string;
  author: {
    id: number;
    fullName: string;
    avatar: {
      id: number;
      name: string;
      url: string;
    };
  };
  previewPicture: {
    id: number;
    name: string;
    url: string;
  };
  tags: Array<TagItem>;
  createdAt: string;
  updatedAt: string;
}

export interface PostsState {
  items: Post[];
  currentPost: FetchPostDetailRequest | null;
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
