import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isAllowedForType } from "../config/routePermissions";
import LoadingSpinner from "../components/LoadingSpinner";
import AccessDenied from "../components/AccessDenied";
import Navbar from "../components/Navbar";

function AuthLayout() {
    const { isAuthenticated, user, loading, logout } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner fullPage message="Carregando..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (!isAllowedForType(location.pathname, user?.type)) {
        return (
            <AccessDenied
                onBack={() => window.history.back()}
                onLogout={logout}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default AuthLayout;
