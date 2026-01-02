import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import UserLayout from "../layouts/UserLayout";
import FavoritesPage from "@/pages/user/FavoritesPage";
import ChatPage from "@/pages/user/chat/ChatPage";


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
