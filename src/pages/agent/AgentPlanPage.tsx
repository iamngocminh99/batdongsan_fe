import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Zap, Crown, Infinity } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type PlanType = "FREE" | "MONTHLY" | "YEARLY" | "THREE_YEAR";

interface Plan {
    id: string;
    type: PlanType;
    name: string;
    price: number;
    unit: string;
    description: string;
    features: string[];
}

export default function AgentPlanPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { user, token } = useAuth();

    const navigate = useNavigate();

    const { refreshUserFromServer, loading } = useAuth();
    const [params] = useSearchParams();
    const status = params.get("status");
    const plan = params.get("plan");
    const msg = params.get("msg");
    const hasRefreshed = useRef(false);

    useEffect(() => {
        if (loading) return;

        if (!hasRefreshed.current && status === "success" && token) {
            hasRefreshed.current = true; // đánh dấu đã gọi
            toast.success(`Gói ${plan} đã được kích hoạt!`);
            setTimeout(() => refreshUserFromServer(), 800); // đợi backend commit xong
        } else if (!hasRefreshed.current && status === "fail") {
            hasRefreshed.current = true;
            toast.error(`Thanh toán thất bại: ${msg || "Lỗi không xác định"}`);
        }
    }, [status, plan, msg, loading, token]);

    // Load danh sách gói
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/plans", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPlans(res.data.content || []);
            } catch (err: any) {
                console.error("Lỗi tải danh sách gói:", err);
                // toast.error("Không thể tải danh sách gói!");
            }
        };

        fetchPlans();
    }, [token]);

    const handleConfirmPayment = async () => {
        if (!selectedPlan || !user?.id) {
            toast.error("Thiếu thông tin Agent hoặc gói!");
            return;
        }

        try {
            const res = await axios.post(
                `http://localhost:8080/api/payment/vnpay/create`,
                {},
                {
                    params: {
                        userId: user.id,
                        planType: selectedPlan.type,
                        amount: selectedPlan.price,
                    },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            window.location.href = res.data;
        } catch (err: any) {
            console.error("Lỗi tạo thanh toán:", err);
            toast.error("Không thể khởi tạo thanh toán!");
        } finally {
            setConfirmOpen(false);
        }
    };

    const getColorGradient = (type: PlanType) => {
        switch (type) {
            case "FREE":
                return "from-gray-100 to-gray-200";
            case "MONTHLY":
                return "from-blue-500 to-indigo-600";
            case "YEARLY":
                return "from-yellow-400 to-amber-500";
            case "THREE_YEAR":
                return "from-purple-500 to-fuchsia-600";
            default:
                return "from-gray-100 to-gray-200";
        }
    };

    const getIcon = (type: PlanType) => {
        switch (type) {
            case "FREE":
                return Star;
            case "MONTHLY":
                return Zap;
            case "YEARLY":
                return Crown;
            case "THREE_YEAR":
                return Infinity;
            default:
                return Star;
        }
    };

    return (
        <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

            <div className="max-w-6xl mx-auto text-center mb-10">
                <div className="flex justify-between items-center mb-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/agent/properties")}
                        className="text-sm"
                    >
                        ← Trở về trang quản lý bài đăng
                    </Button>
                </div>
                <h1 className="text-3xl font-bold text-primary mb-2">Gia hạn & Nâng cấp gói dịch vụ</h1>
                <p className="text-gray-600">
                    Tài khoản hiện tại:{" "}
                    <span className="font-semibold text-blue-600">{user?.planName || "Chưa có gói"}</span> – hết hạn:{" "}
                    <span className="text-red-500 font-semibold">
                        {user?.planEndDate ? new Date(user.planEndDate).toLocaleDateString() : "—"}
                    </span>
                </p>
            </div>

            {/* Nếu chưa tải được plans */}
            {plans.length === 0 ? (
                <p className="text-center text-gray-500">Đang tải danh sách gói...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((p) => {
                        const Icon = getIcon(p.type);
                        const isActive = user?.planName === p.type;

                        return (
                            <motion.div
                                key={p.id}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className={`cursor-pointer border-2 rounded-2xl transition-all duration-300 h-[350px] flex flex-col shadow-sm ${isActive
                                    ? "border-blue-600 shadow-lg"
                                    : "border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                <div className={`bg-gradient-to-r ${getColorGradient(p.type)} text-white rounded-t-2xl p-4`}>
                                    <div className="flex items-center gap-2">
                                        <Icon size={20} />
                                        <h3 className="font-semibold text-lg">{p.name}</h3>
                                    </div>
                                    <p className="text-sm opacity-90">{p.description}</p>
                                </div>

                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div className="text-center">
                                        <p className="text-2xl font-semibold">
                                            {p.price.toLocaleString("vi-VN")}₫
                                            <span className="text-gray-500 text-sm">{p.unit}</span>
                                        </p>
                                    </div>
                                    <ul className="text-sm text-gray-700 space-y-1 mt-3">
                                        {p.features?.map((f, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle2 className="text-green-500 w-4 h-4" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="text-center mb-4">
                                    <Button
                                        disabled={isActive}
                                        onClick={() => {
                                            setSelectedPlan(p);
                                            setConfirmOpen(true);
                                        }}
                                        className={`px-5 py-2 rounded-full ${isActive
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-blue-600 hover:bg-blue-700"
                                            } text-white font-semibold`}
                                    >
                                        {isActive ? "Gói hiện tại" : "Chọn & Thanh toán"}
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* 💬 Modal xác nhận thanh toán */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Xác nhận thanh toán gói</DialogTitle>
                    </DialogHeader>
                    <div className="mt-3">
                        {selectedPlan && (
                            <p>
                                Bạn có chắc muốn thanh toán <b>{selectedPlan.name}</b> với giá{" "}
                                <b>{selectedPlan.price.toLocaleString("vi-VN")}₫</b> không?
                            </p>
                        )}
                    </div>
                    <DialogFooter className="flex justify-end mt-6 gap-2">
                        <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleConfirmPayment} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Xác nhận & Thanh toán
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
