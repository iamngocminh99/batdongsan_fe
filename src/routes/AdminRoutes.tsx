import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import LocationPage from "@/pages/admin/LocationPage";
import UserPage from "@/pages/admin/UserPage";
import PropertyPage from "@/pages/admin/PropertyPage";
import NotificationPage from "@/pages/admin/NotificationPage";


export default function AdminRoutes() {
    return (
        <Routes>
            <Route
                element={
                    <ProtectedRoute role="ADMIN">
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="/locations" element={<LocationPage />} />
                <Route path="/users" element={<UserPage />} />
                <Route path="/properties" element={<PropertyPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
    );
}
