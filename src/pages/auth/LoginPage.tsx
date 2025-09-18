import { useState } from "react";
import { login as loginService } from "../../services/auth.service";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { decodeToken } from "../../utils/jwt";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Home, Eye, EyeOff } from "lucide-react";

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
            } else {
                navigate("/");
            }
        } catch {
            setError("Sai email hoặc mật khẩu");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 text-accent">
                        <Home className="h-8 w-8" />
                        <span className="text-2xl font-bold">PropertyHub</span>
                    </Link>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                        <CardDescription>Nhập thông tin để truy cập tài khoản của bạn</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Gmail của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>

                            {error && <p className="text-red-600 text-sm">{error}</p>}

                            <div className="flex items-center justify-between">
                                <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full">
                                Đăng nhập
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Chưa có tài khoản?{" "}
                                <Link
                                    to="/register"
                                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                                >
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
