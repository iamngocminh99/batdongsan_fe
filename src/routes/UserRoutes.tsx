import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import UserLayout from "../layouts/UserLayout";
import Home from "../pages/user/Home";
import SearchPage from "@/pages/user/SearchPage";
import ProfilePage from "@/pages/user/ProfilePage";
import FavoritesPage from "@/pages/user/FavoritesPage";
import PropertyDetailPage from "@/pages/user/PropertyDetailPage";
import ChatPage from "@/pages/chat/ChatPage";


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
                {/* <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/property/:id" element={<PropertyDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} /> */}
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Route>
        </Routes>
    );
}
