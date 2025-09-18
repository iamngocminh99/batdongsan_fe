import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import LocationPage from "@/pages/admin/LocationPage";


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
                {/* Thêm route admin khác ở đây */}
            </Route>
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
    );
}
