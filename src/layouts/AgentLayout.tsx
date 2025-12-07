import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Home,
    LayoutDashboard,
    LogOut,
    MessageCircle,
    User,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function AgentLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    console.log("AgentLayout user:", user?.maxProperties);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Kiểm tra liên tục mỗi 60 giây
    useEffect(() => {
        if (!user?.planEndDate) return;

        const interval = setInterval(() => {
            const now = new Date();
            const expiry = new Date(user.planEndDate);

            if (expiry < now) {
                alert("Gói của bạn đã hết hạn, vui lòng đăng nhập lại!");
                handleLogout();
            }
        }, 60000); // kiểm tra mỗi 60 giây (60000 ms)

        return () => clearInterval(interval); // dọn dẹp khi unmount
    }, [user]);

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-6 text-primary">Agent Panel</h2>
                <nav className="space-y-2 flex-1">
                    <NavLink
                        to="/agent/properties"
                        className={({ isActive }) =>
                            `flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${isActive
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`
                        }
                    >
                        <Home className="h-4 w-4 text-green-500" />
                        <span>Properties</span>
                    </NavLink>

                    <NavLink
                        to="/agent/chatAgent"
                        className={({ isActive }) =>
                            `flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${isActive
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`
                        }
                    >
                        <MessageCircle className="h-4 w-4 text-blue-700" />
                        <span>Chat</span>
                    </NavLink>
                </nav>


            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col">

                <header className="h-14 border-b bg-card flex items-center justify-between px-6">
                    <div className="flex-1" />

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => navigate("/agent/plan")}
                            className="bg-orange-400 cursor-pointer hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md"
                        >
                            Gia hạn / Nâng cấp gói
                        </Button>

                        {/* Menu user */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                                    <User size={20} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-60">
                                <DropdownMenuLabel className="font-semibold">{user?.email}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Gói hiện tại: {user?.planName || "Chưa có"}</DropdownMenuLabel>
                                <DropdownMenuLabel>
                                    {user?.planEndDate
                                        ? "Hết hạn: " + new Date(user.planEndDate).toLocaleDateString("vi-VN")
                                        : "Chưa kích hoạt"}
                                </DropdownMenuLabel>
                                <DropdownMenuLabel>
                                    Được đăng: {user?.maxProperties} bài đăng
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
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
