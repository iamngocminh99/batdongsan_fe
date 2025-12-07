import { useState } from "react";
import { login as loginService } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { decodeToken } from "../../utils/jwt";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Home, Eye, EyeOff, Mail, Lock, AlertCircle, Leaf, Sun, Heart } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await loginService({ email, password });
            const token = res.data.token;
            login(token);

            const decoded = decodeToken(token);
            const redirect = searchParams.get("redirect");

            if (redirect) {
                navigate(redirect);
            } else if (decoded?.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (decoded?.role === "AGENT") {
                navigate("/agent/properties");
            } else {
                navigate("/");
            }
        } catch (error) {
            setError("Đăng nhập không thành công");
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
                    <p className="mt-4 text-gray-600">Chào mừng bạn trở lại!</p>
                </div>

                <Card className="shadow-xl border-0 overflow-hidden bg-gradient-to-r from-emerald-500 via-amber-400 to-pink-500">
                    <CardHeader className="bg-gradient-to-r from-emerald-500 via-amber-400 to-pink-500 text-white py-10 rounded-t-lg">
                        <CardTitle className="text-2xl font-bold text-center">Đăng nhập</CardTitle>
                        <CardDescription className="text-white/90 text-center">
                            Nhập thông tin để truy cập tài khoản của bạn
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8 px-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-emerald-500" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Gmail của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 font-medium flex items-center">
                                    <Lock className="h-4 w-4 mr-2 text-amber-500" />
                                    Mật khẩu
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-lg h-12 pr-12"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center p-3 bg-pink-50 text-pink-700 rounded-lg border border-pink-200">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-pink-600 hover:text-pink-800 hover:underline transition-colors"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-pink-500 hover:from-emerald-600 hover:via-amber-500 hover:to-pink-600 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Đăng nhập
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Chưa có tài khoản?{" "}
                                <Link
                                    to="/register"
                                    className="text-pink-600 font-medium hover:text-pink-800 hover:underline transition-colors"
                                >
                                    Đăng ký ngay
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