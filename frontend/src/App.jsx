import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useEffect } from "react";
import { LOCAL_STORAGE } from "./config/Enum";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import GetNewPassword from "./pages/GetNewPassword";
import Employees from "./pages/Employees";
import WorkspaceManagmentPage from "./pages/WorkspaceManagmentPage";
import NewsPage from "./pages/NewsPage";
import Tasks from "./pages/Tasks";
import Messages from "./pages/Messages";

function App() {
  const { user, isRestoreFinished, authActions } = useAuthContext();

  useEffect(() => {
    authActions.restore();
  }, []);

  return (
    <div className="App font-rem">
      <BrowserRouter>
        {isRestoreFinished ? (
          <Routes>
            <Route
              path="/"
              element={!user ? <Login /> : <Navigate to="/home" />}
            />
            <Route
              path="/reset-password"
              element={!user ? <ResetPassword /> : <Navigate to="/home" />}
            />
            <Route
              path="/get-new-password"
              element={!user ? <GetNewPassword /> : <Navigate to="/home" />}
            />
            <Route
              path="/home"
              element={user ? <NewsPage /> : <Navigate to="/" />}
            />
            <Route
              path="/employees"
              element={user && user.userTypeName === LOCAL_STORAGE.ADMIN ? <Employees /> : <Navigate to="/" />}
            />
            <Route
              path="/workspaces"
              element={user && user.userTypeName === LOCAL_STORAGE.ADMIN ? <WorkspaceManagmentPage /> : <Navigate to="/" />}
            />
            <Route
              path="/news"
              element={user ? <NewsPage /> : <Navigate to="/" />}
            />
            <Route
              path="/tasks"
              element={user ? <Tasks /> : <Navigate to="/" />}
            />
            <Route
              path="/messages"
              element={user ? <Messages /> : <Navigate to="/" />}
            />
            <Route
              path="*"
              element={user ? <Navigate to="/" /> : null}
            />
          </Routes>
        ) : null}    {/* Loader page */}
      </BrowserRouter>
    </div>
  )
}

export default App
