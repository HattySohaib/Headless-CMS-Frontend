import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import BlogRead from "./pages/BlogRead/BlogRead";
import Playground from "./pages/Playground/Playground";
import Editor from "./pages/Editor/Editor";
import Blogs from "./pages/Blogs/Blogs";
import Categories from "./pages/Categories/Categories";
import AuthorProfile from "./pages/AuthorProfile/AuthorProfile";
import Analytics from "./pages/Analytics/Analytics";
import Dashboard from "./pages/Dashboard/Dashboard";
import AccessTokensPage from "./pages/AccessTokenPage/AccessTokenPage";
import PasswordUpdateForm from "./pages/Password/Password";

import { useAuthContext } from "./contexts/auth";
import { DropAreaProvider } from "./contexts/file";
import { UserProvider } from "./contexts/user";
import { RefreshProvider } from "./contexts/refresh";

import Home from "./pages/Home/Home";
import Signup from "./pages/UserPages/Signup";
import Login from "./pages/UserPages/Login";
import Author from "./pages/Author/Author";

import Navbar from "./components/Navbar/Navbar";
import Draftboard from "./pages/Draftboard/Draftboard";
import Loader from "./components/Loader/Loader";

const App = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <UserProvider>
        <Navbar />
      </UserProvider>
      <Routes>
        <Route index element={<Home />} />
        <Route index path="blogs" element={<Blogs />} />
        <Route
          path="playground"
          element={user ? <Playground /> : <Navigate to={"/login"} />}
        >
          <Route
            index
            path="dashboard"
            element={
              <UserProvider>
                <Analytics />
              </UserProvider>
            }
          />
          <Route
            path="featured-blogs"
            element={
              <RefreshProvider>
                <Dashboard />
              </RefreshProvider>
            }
          />
          <Route
            path="all-blogs"
            element={
              <RefreshProvider>
                <Draftboard />
              </RefreshProvider>
            }
          />
          <Route path="categories" element={<Categories />} />
          <Route path="edit-profile" element={<AuthorProfile />} />
          <Route path="change-password" element={<PasswordUpdateForm />} />
          <Route path="get-api-key" element={<AccessTokensPage />} />
        </Route>
        <Route
          path="editor"
          element={
            user ? (
              <DropAreaProvider>
                <Editor />
              </DropAreaProvider>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="editor/:blog"
          element={
            user ? (
              <DropAreaProvider>
                <Editor />
              </DropAreaProvider>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="signup"
          element={!user ? <Signup /> : <Navigate to={"/"} />}
        />
        <Route
          path="login"
          element={!user ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="author/:id"
          element={
            <UserProvider>
              <Author />
            </UserProvider>
          }
        />
        <Route
          path="read-this-blog/:id"
          element={
            <UserProvider>
              <BlogRead />
            </UserProvider>
          }
        />
        <Route path="*" element={<h1>Error 404, please enter valid URL!</h1>} />
      </Routes>
    </>
  );
};

export default App;
