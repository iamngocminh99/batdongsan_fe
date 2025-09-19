import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, Heart, MessageCircle, Bell, User } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "@/utils/useNotifications";

export default function UserLayout() {
    const { user, logout } = useAuth();
    const { notifications, markAsRead, unreadCount } = useNotifications();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-md hover:bg-gray-100">
                            <Menu size={22} />
                        </button>
                        <h1 className="text-xl font-bold text-orange-500">NgocMinh</h1>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        {/* Nút Favorites */}
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full"
                            onClick={() => navigate("/favorites")}
                        >
                            <Heart size={20} />
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <MessageCircle size={20} />
                        </button>

                        {/* Notification */}
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="p-2 hover:bg-gray-100 rounded-full relative"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {open && (
                                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg max-h-96 overflow-y-auto z-50">
                                    <div className="p-2 border-b font-semibold">Thông báo</div>
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-gray-500 text-sm">
                                            Không có thông báo
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`p-3 border-b hover:bg-gray-50 text-sm cursor-pointer ${n.read ? "bg-gray-100" : "bg-white"
                                                    }`}
                                                onClick={async () => {
                                                    await markAsRead(n.id);
                                                    if (n.link) {
                                                        navigate(n.link);
                                                    }
                                                }}
                                            >
                                                <div className="font-medium">{n.title}</div>
                                                <div className="text-gray-600">{n.message}</div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(n.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {!user ? (
                            <>
                                <Button variant="outline">Đăng nhập</Button>
                                <Button className="bg-orange-500 hover:bg-orange-600">
                                    Đăng tin
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm">
                                    Xin chào, <b>{user.email}</b>
                                </span>
                                <Button onClick={logout} variant="destructive">
                                    Đăng xuất
                                </Button>
                            </div>
                        )}

                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 container mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}
