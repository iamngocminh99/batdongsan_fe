import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactElement } from "react";

export default function GuestRoute({
    children,
}: {
    children: ReactElement;
}) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // Nếu đã login thì không cho vào login/register nữa
    if (user) {
        if (user.role === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
}
