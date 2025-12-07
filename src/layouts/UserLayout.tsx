import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, Heart, MessageCircle, Bell, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotifications } from "@/utils/useNotifications";
import axios from "axios";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const favoriteBus = (() => {
    const listeners = new Set<() => void>();
    return {
        subscribe(fn: () => void) {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },
        emit() {
            listeners.forEach(fn => fn());
        },
    };
})();

(window as any).favoriteBus = favoriteBus;


export default function UserLayout() {
    const { user, logout, token } = useAuth();
    const { notifications, markAsRead, unreadCount } = useNotifications();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState<string[]>([])

    useEffect(() => {
        if (!user) return;

        const loadFavorites = () => {
            axios
                .get(`http://localhost:8080/api/favorites/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(res => setFavorites(res.data.map((fav: any) => fav.property.id)))
                .catch(() => { });
        };

        loadFavorites(); // gọi khi mount

        //nghe tín hiệu từ HomePage
        const unsubscribe = favoriteBus.subscribe(loadFavorites);
        return () => {
            unsubscribe();
        };
    }, [user, token]);


    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="data:image/jpeg;base64,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"
                            alt="Logo"
                            className="h-8 w-8 mr-2 cursor-pointer"
                            onClick={() => navigate("/")}
                        />
                        <h1
                            className="text-xl font-bold text-orange-500 cursor-pointer"
                            onClick={() => navigate("/")}
                        >
                            NgocMinh
                        </h1>
                    </div>


                    <div className="flex items-center gap-4 relative">
                        {/* Nút Favorites */}
                        <div className="relative">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                                onClick={() => navigate("/favorites")}
                            >
                                <Heart size={20} />
                                {favorites.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-1">
                                        {favorites.length}
                                    </span>
                                )}
                            </button>
                        </div>


                        <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer" onClick={() => navigate("/chat")}>
                            <MessageCircle size={20} />
                        </button>

                        {/* Notification */}
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
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
                                <Button onClick={() => navigate("/login")} variant="outline">Đăng nhập</Button>
                                {/* <Button className="bg-orange-500 hover:bg-orange-600">
                                    Đăng tin
                                </Button> */}
                            </>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                                        <User size={20} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-60">
                                    <DropdownMenuLabel>
                                        {user.email}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-600"
                                        onClick={logout}
                                    >
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

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
