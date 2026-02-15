import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "constant/queryClient";

import { AuthProvider } from "contexts/AuthContext";

import { PublicRoute } from "components/routes/PublicRoutes";
import { ProtectedRoute } from "components/routes/ProtectedRoutes";

import AccessDenied from "components/routes/AccessDenied";
import ArtistAssociationRequired from "components/songs/ArtistAssociationRequired";

import Login from "pages/Login";
import Register from "pages/Register";
import Dashboard from "pages/Dashboard";
import Users from "pages/Users";
import Artists from "pages/Artists";
import Songs from "pages/Songs";
import SongsByArtist from "pages/SongsByArtist";
import NotFound from "pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
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

        {/* Protected Routes */}
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
            <ProtectedRoute allowedRoles={["artist"]}>
              <Songs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artist-association-required"
          element={
            <ProtectedRoute allowedRoles={["artist"]}>
              <ArtistAssociationRequired />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artists/:artistId/songs"
          element={
            <ProtectedRoute allowedRoles={["artist_manager", "super_admin"]}>
              <SongsByArtist />
            </ProtectedRoute>
          }
        />

        {/* Fallback Routes */}
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
