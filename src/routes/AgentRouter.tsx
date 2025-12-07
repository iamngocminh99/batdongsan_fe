import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AgentLayout from "@/layouts/AgentLayout";
import PropertyAgentPage from "@/pages/agent/PropertyAgentPage";
import ChatAgentPage from "@/pages/agent/chat/ChatAgentPage";


export default function AgentRoutes() {
    return (
        <Routes>
            <Route
                element={
                    <ProtectedRoute role="AGENT">
                        <AgentLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/properties" element={<PropertyAgentPage />} />
                <Route path="/chatAgent" element={<ChatAgentPage />} />
            </Route>

        </Routes>
    );
}
