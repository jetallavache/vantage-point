import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";
import { LoginPage } from "./features/auth/ui/LoginPage";
import { PrivateRoute } from "./shared/ui/PrivateRoute";
import { AdminLayout } from "./shared/ui/AdminLayout";

const PostsPage = React.lazy(() => import("./features/posts/ui/PostsPage"));
const PostDetailPage = React.lazy(
  () => import("./features/posts/ui/PostDetailPage")
);
const PostFormPage = React.lazy(
  () => import("./features/posts/ui/PostFormPage")
);
const AuthorsPage = React.lazy(
  () => import("./features/authors/ui/AuthorsPage")
);
const AuthorFormPage = React.lazy(
  () => import("./features/authors/ui/AuthorFormPage")
);
const AuthorDetailPage = React.lazy(
  () => import("./features/authors/ui/AuthorDetailPage")
);
const TagsPage = React.lazy(() => import("./features/tags/ui/TagsPage"));
const TagFormPage = React.lazy(() => import("./features/tags/ui/TagFormPage"));
const TagDetailPage = React.lazy(
  () => import("./features/tags/ui/TagDetailPage")
);

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
    }}
  >
    <Spin size="large" />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Navigate to="/posts" replace />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/posts"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <PostsPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/posts/form"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <PostFormPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/posts/form/:id"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <PostFormPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/posts/detail/:id"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <PostDetailPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/authors"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <AuthorsPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/authors/add"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <AuthorFormPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/authors/detail/:id"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <AuthorDetailPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/authors/edit/:id"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <AuthorFormPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/tags"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <TagsPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/tags/add"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <TagFormPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/tags/detail/:id"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <TagDetailPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/tags/edit/:id"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <TagFormPage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
