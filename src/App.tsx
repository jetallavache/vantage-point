import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";
import { LoginPage } from "./features/auth";
import { PrivateRoute, AdminLayout } from "./shared";

const PostsPage = React.lazy(() =>
  import("./features/posts").then((m) => ({ default: m.PostsPage }))
);
const PostDetailPage = React.lazy(() =>
  import("./features/posts").then((m) => ({ default: m.PostDetailPage }))
);
const PostFormPage = React.lazy(() =>
  import("./features/posts").then((m) => ({ default: m.PostFormPage }))
);
const AuthorsPage = React.lazy(() =>
  import("./features/authors").then((m) => ({ default: m.AuthorsPage }))
);
const AuthorFormPage = React.lazy(() =>
  import("./features/authors").then((m) => ({ default: m.AuthorFormPage }))
);
const AuthorDetailPage = React.lazy(() =>
  import("./features/authors").then((m) => ({ default: m.AuthorDetailPage }))
);
const TagsPage = React.lazy(() =>
  import("./features/tags").then((m) => ({ default: m.TagsPage }))
);
const TagFormPage = React.lazy(() =>
  import("./features/tags").then((m) => ({ default: m.TagFormPage }))
);
const TagDetailPage = React.lazy(() =>
  import("./features/tags").then((m) => ({ default: m.TagDetailPage }))
);
const MenuManagePage = React.lazy(() =>
  import("./features/menu").then((m) => ({ default: m.MenuManagePage }))
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

      <Route
        path="/menu"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <MenuManagePage />
              </Suspense>
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
