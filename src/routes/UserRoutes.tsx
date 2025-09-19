import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/user/Home";
import SearchPage from "@/pages/user/SearchPage";
import PropertyDetails from "@/pages/user/PropertyDetails";
import ProfilePage from "@/pages/user/ProfilePage";
import FavoritesPage from "@/pages/user/FavoritesPage";


export default function UserRoutes() {
    return (
        <Routes>
            <Route
                element={
                    <ProtectedRoute role="USER">
                        <UserLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/property-details" element={<PropertyDetails />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
