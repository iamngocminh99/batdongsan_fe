import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:8080/api/users";

type Role = "ADMIN" | "USER" | "AGENT";

interface User {
    id?: string;
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: Role;
    createdAt?: string;
}

export default function UserPage() {
    const { token } = useAuth();

    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [filterEmail, setFilterEmail] = useState("");
    const [filterRole, setFilterRole] = useState<Role | "">("");

    const [openDialog, setOpenDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form, setForm] = useState<User>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        role: "USER",
    });

    useEffect(() => {
        fetchData();
    }, [page, size, filterEmail, filterRole]);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page,
                    size,
                    email: filterEmail,
                    role: filterRole || undefined,
                },
            });
            setUsers(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch {
            toast.error("Không thể tải danh sách users");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (value: string) => {
        setForm({ ...form, role: value as Role });
    };

    const handleSubmit = async () => {
        try {
            if (editingUser) {
                await axios.put(`${API_URL}/${editingUser.id}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Cập nhật thành công");
            } else {
                await axios.post(API_URL, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Thêm mới thành công");
            }
            setOpenDialog(false);
            setEditingUser(null);
            fetchData();
        } catch {
            toast.error("Lỗi khi lưu user");
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm("Bạn có chắc chắn muốn xóa user này?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Xóa thành công");
            fetchData();
        } catch {
            toast.error("Lỗi khi xóa user");
        }
    };

    const openEditDialog = (user: User) => {
        setEditingUser(user);
        setForm({ ...user, password: "" }); // không show password cũ
        setOpenDialog(true);
    };

    const openAddDialog = () => {
        setEditingUser(null);
        setForm({
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phone: "",
            role: "USER",
        });
        setOpenDialog(true);
    };

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Quản lý Users</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Filter */}
                    <div className="flex gap-4 mb-4">
                        <Input
                            placeholder="Email..."
                            value={filterEmail}
                            onChange={(e) => setFilterEmail(e.target.value)}
                        />
                        <Select onValueChange={(val) => setFilterRole(val as Role | "")}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="AGENT">Agent</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={fetchData}>Lọc</Button>
                        <Button onClick={openAddDialog}>+ Thêm mới</Button>
                    </div>

                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Họ tên</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{u.firstName} {u.lastName}</TableCell>
                                    <TableCell>{u.phone}</TableCell>
                                    <TableCell>{u.role}</TableCell>
                                    <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size="sm" onClick={() => openEditDialog(u)}>Sửa</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>Xóa</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex justify-between mt-4">
                        <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
                            Trang trước
                        </Button>
                        <span>
                            Trang {page + 1} / {totalPages}
                        </span>
                        <Button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                            Trang sau
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog Add/Edit */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Sửa User" : "Thêm User"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Email</Label>
                            <Input name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        {!editingUser && (
                            <div>
                                <Label>Password</Label>
                                <Input name="password" type="password" value={form.password} onChange={handleChange} required />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Họ</Label>
                                <Input name="firstName" value={form.firstName} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Tên</Label>
                                <Input name="lastName" value={form.lastName} onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input name="phone" value={form.phone || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Role</Label>
                            <Select value={form.role} onValueChange={handleRoleChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="AGENT">Agent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleSubmit} className="w-full">
                            {editingUser ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
