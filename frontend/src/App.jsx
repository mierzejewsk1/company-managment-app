import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useEffect } from "react";
import { LOCAL_STORAGE } from "./config/Enum";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import GetNewPassword from "./pages/GetNewPassword";
import Home from "./pages/Home";
import AdministratorHomepage from "./pages/AdministratorHomepage";
import WorkspaceManagmentPage from "./pages/WorkspaceManagmentPage";
//import '../dist/output.css';

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
              element={user ? (user.userTypeName === LOCAL_STORAGE.ADMIN ? <AdministratorHomepage /> : (user.userTypeName === LOCAL_STORAGE.WORKER ? <Home /> : <Navigate to="/" />)) : <Navigate to="/" />}
            />
            <Route
              path="/workspaces"
              element={user ? (user.userTypeName === LOCAL_STORAGE.ADMIN ? <WorkspaceManagmentPage /> : (user.userTypeName === LOCAL_STORAGE.WORKER ? <Home /> : <Navigate to="/" />)) : <Navigate to="/" />}
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
