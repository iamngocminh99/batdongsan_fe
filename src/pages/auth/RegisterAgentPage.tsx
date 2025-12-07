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
import { Home, User, Mail, Lock, Building, Phone, MapPin, Globe, FileText, CheckCircle, Leaf, Sun, Heart } from "lucide-react";
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
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
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
                    <p className="mt-4 text-gray-600">Tạo tài khoản môi giới chuyên nghiệp</p>
                </div>

                <Card className="shadow-xl border-0 overflow-hidden bg-gradient-to-r from-emerald-500 via-amber-400 to-pink-500">
                    <CardHeader className="bg-gradient-to-r from-emerald-500 via-amber-400 to-pink-500 text-white pb-8">
                        <CardTitle className="text-2xl font-bold text-center">Đăng ký Agent</CardTitle>
                        <CardDescription className="text-white/90 text-center">
                            Tạo tài khoản môi giới để bắt đầu quản lý bất động sản
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 px-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Họ tên */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-gray-700 font-medium flex items-center">
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
                                        placeholder="Tên của bạn"
                                        onChange={handleChange}
                                        required
                                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-12"
                                    />
                                </div>
                            </div>

                            {/* Email & Password */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-amber-500" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email của bạn"
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

                            {/* Thông tin công ty */}
                            <div className="space-y-2">
                                <Label htmlFor="companyName" className="text-gray-700 font-medium flex items-center">
                                    <Building className="h-4 w-4 mr-2 text-emerald-500" />
                                    Tên công ty
                                </Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    placeholder="Công ty BĐS ABC"
                                    onChange={handleChange}
                                    required
                                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-12"
                                />
                            </div>

                            {/* Phone & Mobile */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-amber-500" />
                                        Điện thoại (cố định)
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="0281234567"
                                        onChange={handleChange}
                                        className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-lg h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobile" className="text-gray-700 font-medium flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-amber-500" />
                                        Di động
                                    </Label>
                                    <Input
                                        id="mobile"
                                        name="mobile"
                                        placeholder="0909123456"
                                        onChange={handleChange}
                                        className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-lg h-12"
                                    />
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-gray-700 font-medium flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                                    Địa chỉ
                                </Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="123 Lê Lợi, Quận 1"
                                    onChange={handleChange}
                                    required
                                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-gray-700 font-medium flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                                    Thành phố
                                </Label>
                                <Input
                                    id="city"
                                    name="city"
                                    placeholder="Hồ Chí Minh"
                                    onChange={handleChange}
                                    required
                                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-12"
                                />
                            </div>

                            {/* Logo */}
                            <div className="space-y-2">
                                <Label htmlFor="logo" className="text-gray-700 font-medium flex items-center">
                                    <Globe className="h-4 w-4 mr-2 text-pink-500" />
                                    Logo (URL)
                                </Label>
                                <Input
                                    id="logo"
                                    name="logo"
                                    placeholder="https://example.com/logo.png"
                                    onChange={handleChange}
                                    className="border-gray-300 focus:border-pink-500 focus:ring-pink-500 rounded-lg h-12"
                                />
                            </div>

                            {/* Mô tả */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-700 font-medium flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-amber-500" />
                                    Mô tả
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Giới thiệu về dịch vụ môi giới của bạn"
                                    onChange={handleChange}
                                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-lg min-h-[100px]"
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
                                Đăng ký Agent
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Đã có tài khoản?{" "}
                                <Link
                                    to="/login"
                                    className="text-emerald-600 font-medium hover:text-emerald-800 hover:underline transition-colors"
                                >
                                    Đăng nhập ngay
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