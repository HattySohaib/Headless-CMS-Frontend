import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import BlogRead from "./pages/BlogRead/BlogRead";
import Playground from "./pages/Playground/Playground";
import Editor from "./pages/Editor/Editor";
import Blogs from "./pages/Blogs/Blogs";
import Categories from "./pages/Categories/Categories";
import Analytics from "./pages/Analytics/Analytics";
import Dashboard from "./pages/Dashboard/Dashboard";
import Messages from "./pages/Messages/Messages";
import Settings from "./pages/Settings/Settings";

import { useAuthContext } from "./contexts/auth";
import { ApiErrorProvider } from "./contexts/apiError";
import { DropAreaProvider } from "./contexts/file";
import { UserProvider } from "./contexts/user";
import { RefreshProvider } from "./contexts/refresh";

import Home from "./pages/Home/Home";
import Signup from "./pages/UserPages/Signup";
import Login from "./pages/UserPages/Login";
import Author from "./pages/Author/Author";

import Navbar from "./components/Navbar/Navbar";
import Draftboard from "./pages/Draftboard/Draftboard";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import OfflineBanner from "./components/OfflineBanner/OfflineBanner";
import NotFound from "./pages/NotFound/NotFound";

const App = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <ApiErrorProvider>
      <ErrorBoundary
        title="Application Error"
        message="We're experiencing some technical difficulties. Please try refreshing the page."
        showContact={true}
      >
        <OfflineBanner />
        <ErrorBoundary
          title="Navigation Error"
          message="There was an issue with the navigation bar."
        >
          <UserProvider>
            <Navbar />
          </UserProvider>
        </ErrorBoundary>{" "}
        <Routes>
          <Route
            index
            element={
              <ErrorBoundary title="Homepage Error">
                <Home />
              </ErrorBoundary>
            }
          />

          <Route
            path="blogs"
            element={
              <ErrorBoundary title="Blogs Page Error">
                <Blogs />
              </ErrorBoundary>
            }
          />

          <Route
            path="categories"
            element={
              <ErrorBoundary title="Categories Error">
                <Categories />
              </ErrorBoundary>
            }
          />

          <Route
            path="playground"
            element={
              user ? (
                <ErrorBoundary title="Playground Error">
                  <Playground />
                </ErrorBoundary>
              ) : (
                <Navigate to={"/login"} />
              )
            }
          >
            <Route
              path="dashboard"
              element={
                <ErrorBoundary title="Analytics Dashboard Error">
                  <UserProvider>
                    <Analytics />
                  </UserProvider>
                </ErrorBoundary>
              }
            />
            <Route
              path="featured-blogs"
              element={
                <ErrorBoundary title="Featured Blogs Error">
                  <RefreshProvider>
                    <Dashboard />
                  </RefreshProvider>
                </ErrorBoundary>
              }
            />
            <Route
              path="all-blogs"
              element={
                <ErrorBoundary title="Blogs Management Error">
                  <RefreshProvider>
                    <Draftboard />
                  </RefreshProvider>
                </ErrorBoundary>
              }
            />
            <Route
              path="messages"
              element={
                <ErrorBoundary title="Messages Error">
                  <RefreshProvider>
                    <Messages />
                  </RefreshProvider>
                </ErrorBoundary>
              }
            />
            <Route
              path="settings"
              element={
                <ErrorBoundary title="Settings Error">
                  <Settings />
                </ErrorBoundary>
              }
            />
          </Route>

          <Route
            path="editor"
            element={
              user ? (
                <ErrorBoundary title="Editor Error">
                  <DropAreaProvider>
                    <Editor />
                  </DropAreaProvider>
                </ErrorBoundary>
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />

          <Route
            path="editor/:blog"
            element={
              user ? (
                <ErrorBoundary title="Blog Editor Error">
                  <DropAreaProvider>
                    <Editor />
                  </DropAreaProvider>
                </ErrorBoundary>
              ) : (
                <Navigate to={"/login"} />
              )
            }
          />

          <Route
            path="signup"
            element={
              !user ? (
                <ErrorBoundary title="Signup Error">
                  <Signup />
                </ErrorBoundary>
              ) : (
                <Navigate to={"/"} />
              )
            }
          />

          <Route
            path="login"
            element={
              !user ? (
                <ErrorBoundary title="Login Error">
                  <Login />
                </ErrorBoundary>
              ) : (
                <Navigate to={"/"} />
              )
            }
          />

          <Route
            path="author/:id"
            element={
              <ErrorBoundary title="Author Profile Error">
                <UserProvider>
                  <Author />
                </UserProvider>
              </ErrorBoundary>
            }
          />

          <Route
            path="read-this-blog/:id"
            element={
              <ErrorBoundary title="Blog Reading Error">
                <UserProvider>
                  <BlogRead />
                </UserProvider>
              </ErrorBoundary>
            }
          />

          <Route
            path="*"
            element={
              <ErrorBoundary title="Page Not Found">
                <NotFound />
              </ErrorBoundary>
            }
          />
        </Routes>
      </ErrorBoundary>
    </ApiErrorProvider>
  );
};

export default App;
