import { Outlet, Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IoNotifications } from "react-icons/io5";
import {
    Home,
    LayoutDashboard,
    Locate,
    LogOut,
    User,
} from "lucide-react";
import { FaLocationDot } from "react-icons/fa6";

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-6 text-primary">Admin Panel</h2>
                <nav className="space-y-2 flex-1">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`
                        }
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`
                        }
                    >
                        <User className="h-4 w-4 te" />
                        <span>Users</span>
                    </NavLink>

                    <NavLink
                        to="/admin/properties"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`
                        }
                    >
                        <Home className="h-4 w-4 text-green-500" />
                        <span>Properties</span>
                    </NavLink>

                    <NavLink
                        to="/admin/notifications"
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`
                        }
                    >
                        <IoNotifications className="h-4 w-4 text-amber-600" />
                        <span>Notifications</span>
                    </NavLink>
                </nav>
                <div className="mt-auto">
                    <Button
                        variant="destructive"
                        className="w-full flex items-center justify-center space-x-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Đăng xuất</span>
                    </Button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col">
                <header className="h-14 border-b bg-card flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold">
                        Xin chào <span className="text-primary">{user?.email}</span>
                    </h1>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    <Card className="p-4">
                        <Outlet />
                    </Card>
                </div>
            </main>
        </div>
    );
}
