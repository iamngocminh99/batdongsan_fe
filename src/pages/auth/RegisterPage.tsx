import { useState } from "react";
import { register } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
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
                toast.success("Đăng ký thành công. Vui loàng xác thực gmail của bạn để đăng nhập");
            }
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            toast.error("Gmail đã tồn tại!")
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
                        <CardTitle className="text-2xl">Đăng ký</CardTitle>
                        <CardDescription>Tạo tài khoản mới để bắt đầu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Họ</Label>
                                    <Input id="firstName" name="firstName" placeholder="Nguyễn" onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Tên</Label>
                                    <Input id="lastName" name="lastName" placeholder="Văn A" onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="Gmail của bạn" onChange={handleChange} required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input id="password" name="password" type="password" placeholder="Nhập mật khẩu" onChange={handleChange} required />
                            </div>

                            {message && <p className="text-sm text-center text-muted-foreground">{message}</p>}

                            <Button type="submit" className="w-full">Đăng ký</Button>
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
