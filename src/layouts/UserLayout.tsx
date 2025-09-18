import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Menu, Heart, MessageCircle, Bell, User } from "lucide-react";

export default function UserLayout() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">

                    {/* Left: Logo + Menu */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-md hover:bg-gray-100">
                            <Menu size={22} />
                        </button>
                        <h1 className="text-xl font-bold text-orange-500">NgocMinh</h1>
                        <Select defaultValue="danang">
                            <SelectTrigger className="w-[140px] border-orange-300 bg-orange-50 text-orange-600">
                                <SelectValue placeholder="Chọn nơi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hanoi">Hà Nội</SelectItem>
                                <SelectItem value="danang">Đà Nẵng</SelectItem>
                                <SelectItem value="hcm">Hồ Chí Minh</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Right: Icons + Buttons */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Heart size={20} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <MessageCircle size={20} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Bell size={20} />
                        </button>

                        {!user ? (
                            <>
                                <Button variant="outline">Đăng nhập</Button>
                                <Button className="bg-orange-500 hover:bg-orange-600">Đăng tin</Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Xin chào, <b>{user.email}</b></span>
                                <Button onClick={logout} variant="destructive">Đăng xuất</Button>
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
