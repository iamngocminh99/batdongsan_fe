import { useState } from "react";
import { register, registerAgent } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Home } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterAgentPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        mobile: "",
        companyName: "",
        address: "",
        city: "",
        logo: "",
        description: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await registerAgent(form);
            if (res) {
                toast.success(
                    "Đăng ký thành công. Vui lòng xác thực email của bạn để đăng nhập"
                );
            }
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            toast.error("Email đã tồn tại!");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2 text-accent">
                        <Home className="h-8 w-8" />
                        <span className="text-2xl font-bold">PropertyHub</span>
                    </Link>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Đăng ký Agent</CardTitle>
                        <CardDescription>
                            Tạo tài khoản môi giới để bắt đầu quản lý bất động sản
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Họ tên */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Họ</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Nguyễn"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Tên</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Văn B"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email & Password */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email của bạn"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Nhập mật khẩu"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Thông tin công ty */}
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Tên công ty</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    placeholder="Công ty BĐS ABC"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Phone & Mobile */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Điện thoại (cố định)</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="0281234567"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobile">Di động</Label>
                                    <Input
                                        id="mobile"
                                        name="mobile"
                                        placeholder="0909123456"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Địa chỉ</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="123 Lê Lợi, Quận 1"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city">Thành phố</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    placeholder="Hồ Chí Minh"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Logo */}
                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo (URL)</Label>
                                <Input
                                    id="logo"
                                    name="logo"
                                    placeholder="https://example.com/logo.png"
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Mô tả */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Giới thiệu về dịch vụ môi giới của bạn"
                                    onChange={handleChange}
                                    className="resize-none"
                                />
                            </div>

                            {message && (
                                <p className="text-sm text-center text-muted-foreground">
                                    {message}
                                </p>
                            )}

                            <Button type="submit" className="w-full">
                                Đăng ký Agent
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Đã có tài khoản?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
