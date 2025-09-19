import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:8080/api/notifications";

interface Notification {
    id: string;
    title: string;
    message: string;
    link?: string;
    type: "PROMOTION" | "POLICY" | "SYSTEM" | "EVENT";
    createdAt: string;
    read: boolean;
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
}

export default function NotificationPage() {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState({
        title: "",
        message: "",
        link: "",
        type: "POLICY",
    });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách thông báo");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await axios.post(`${API_URL}/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Đã đánh dấu đã đọc");
            fetchNotifications();
        } catch (err) {
            toast.error("Lỗi khi đánh dấu đã đọc");
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`${API_URL}/broadcast`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Gửi thông báo thành công");
            setOpenDialog(false);
            setForm({ title: "", message: "", link: "", type: "POLICY" });
            fetchNotifications();
        } catch (err) {
            toast.error("Lỗi khi gửi thông báo");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Quản lý thông báo</CardTitle>
                    <Button onClick={() => setOpenDialog(true)}>+ Gửi broadcast</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Nội dung</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Người gửi</TableHead>
                                <TableHead>Người nhận</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {notifications.map((n) => (
                                <TableRow key={n.id}>
                                    <TableCell>{n.title}</TableCell>
                                    <TableCell>{n.message}</TableCell>
                                    <TableCell>{n.type}</TableCell>
                                    <TableCell>{n.senderName}</TableCell>
                                    <TableCell>{n.receiverName}</TableCell>
                                    <TableCell>{new Date(n.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        {n.read ? (
                                            <span className="text-green-600">Đã đọc</span>
                                        ) : (
                                            <span className="text-red-600">Chưa đọc</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {!n.read && (
                                            <Button size="sm" onClick={() => markAsRead(n.id)}>
                                                Đánh dấu đã đọc
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Dialog broadcast */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gửi thông báo broadcast</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Tiêu đề</Label>
                            <Input
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Nội dung</Label>
                            <Input
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Link</Label>
                            <Input
                                value={form.link}
                                onChange={(e) => setForm({ ...form, link: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Loại</Label>
                            <Select
                                value={form.type}
                                onValueChange={(val) => setForm({ ...form, type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="POLICY">Policy</SelectItem>
                                    <SelectItem value="PROMOTION">Promotion</SelectItem>
                                    <SelectItem value="SYSTEM">System</SelectItem>
                                    <SelectItem value="EVENT">Event</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleSubmit} className="w-full">
                            Gửi
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
