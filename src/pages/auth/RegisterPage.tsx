import { useState } from "react";
import { register } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Home, User, Mail, Lock, CheckCircle, AlertCircle, Leaf, Sun, Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await register(form);
            if (res) {
                toast.success("Đăng ký thành công. Vui lòng xác thực gmail của bạn để đăng nhập");
            }
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            toast.error("Gmail đã tồn tại!")
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center space-x-2 text-emerald-600 group">
                        <div className="bg-white p-3 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-emerald-100">
                            <Home className="h-8 w-8" />
                        </div>
                        <div>
                            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-amber-500 to-pink-500 bg-clip-text text-transparent">
                                Ngọc Minh
                            </span>
                            <div className="flex justify-center space-x-1 mt-1">
                                <Leaf className="h-4 w-4 text-emerald-500" />
                                <Sun className="h-4 w-4 text-amber-500" />
                                <Heart className="h-4 w-4 text-pink-500" />
                            </div>
                        </div>
                    </Link>
                    <p className="mt-4 text-gray-600">Tạo tài khoản mới của bạn</p>
                </div>

                <Card className="shadow-xl border-0 overflow-hidden bg-gradient-to-r from-emerald-500 via-amber-400 to-pink-500">
                    <CardHeader className="bg-gradient-to-r from-emerald-500 via-amber-400 to-pink-500 text-white pb-8">
                        <CardTitle className="text-2xl font-bold text-center">Đăng ký</CardTitle>
                        <CardDescription className="text-white/90 text-center">
                            Tạo tài khoản mới để bắt đầu
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 px-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-gray-700 font-medium flex items-center">
                                        <User className="h-4 w-4 mr-2 text-emerald-500" />
                                        Họ
                                    </Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Họ của bạn"
                                        onChange={handleChange}
                                        required
                                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-gray-700 font-medium flex items-center">
                                        <User className="h-4 w-4 mr-2 text-emerald-500" />
                                        Tên
                                    </Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        placeholder="tên của bạn"
                                        onChange={handleChange}
                                        required
                                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-amber-500" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Gmail của bạn"
                                    onChange={handleChange}
                                    required
                                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-lg h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 font-medium flex items-center">
                                    <Lock className="h-4 w-4 mr-2 text-pink-500" />
                                    Mật khẩu
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    onChange={handleChange}
                                    required
                                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg h-12"
                                />
                            </div>

                            {message && (
                                <div className="flex items-center p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    <span className="text-sm">{message}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-pink-500 hover:from-emerald-600 hover:via-amber-500 hover:to-pink-600 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Đăng ký
                            </Button>
                        </form>

                        <div className="mt-8 text-center space-y-3">
                            <p className="text-sm text-gray-600">
                                Đã có tài khoản?{" "}
                                <Link
                                    to="/login"
                                    className="text-emerald-600 font-medium hover:text-emerald-800 hover:underline transition-colors"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </p>
                            <p className="text-sm text-gray-600">
                                Bạn là môi giới?{" "}
                                <Link
                                    to="/register-agent"
                                    className="text-pink-600 font-medium hover:text-pink-800 hover:underline transition-colors"
                                >
                                    Đăng ký tài khoản môi giới
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center text-sm text-gray-500">
                    © 2023 Ngọc Minh. Tất cả quyền được bảo lưu.
                </div>
            </div>
        </div>
    );
}