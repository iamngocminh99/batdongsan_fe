import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactElement } from "react";

export default function ProtectedRoute({
    children,
    role,
}: {
    children: ReactElement;
    role: "USER" | "ADMIN";
}) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
    }

    if (user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
}
