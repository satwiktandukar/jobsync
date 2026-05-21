import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import "./index.css";
import Dashboard from "./pages/Dashboard.tsx";
import Register from "./components/Register.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import Login from "./components/Login.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="auth" element={<AuthPage />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
