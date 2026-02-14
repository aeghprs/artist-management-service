import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import AccessDenied from "components/routes/AccessDenied";
import { PublicRoute } from "components/routes/PublicRoutes";
import { ProtectedRoute } from "components/routes/ProtectedRoutes";

import { AuthProvider } from "contexts/AuthContext";

import Login from "pages/Login";
import Register from "pages/Register";
import Dashboard from "pages/Dashboard";
import Users from "pages/Users";
import Artists from "pages/Artists";
import Songs from "pages/Songs";
import SongsByArtist from "pages/SongsByArtist";
import NotFound from "pages/NotFound";
import queryClient from "constant/queryClient";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["super_admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artists"
          element={
            <ProtectedRoute allowedRoles={["super_admin", "artist_manager"]}>
              <Artists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/songs"
          element={
            <ProtectedRoute
              allowedRoles={["artist"]}
            >
              <Songs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artists/:artistId/songs"
          element={
            <ProtectedRoute allowedRoles={["artist"]}>
              <SongsByArtist />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
