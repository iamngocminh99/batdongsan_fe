import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import GuestRoute from "./routes/GuestRoute";
import RegisterAgentPage from "./pages/auth/RegisterAgentPage";
import AgentRoutes from "./routes/AgentRouter";
import SearchPage from "./pages/user/SearchPage";
import Home from "./pages/user/Home";
import PropertyDetailPage from "./pages/user/PropertyDetailPage";
import UserLayout from "./layouts/UserLayout";
import AgentPlanPage from "./pages/agent/AgentPlanPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />

          </Route>

          <Route path="/agent/plan" element={<AgentPlanPage />} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register-agent"
            element={
              <GuestRoute>
                <RegisterAgentPage />
              </GuestRoute>
            }
          />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/agent/*" element={<AgentRoutes />} />
        </Routes>
      </BrowserRouter>
      {/* {user?.role === "USER" && <ChatPage />} */}
    </AuthProvider>
  );
}

export default App;
