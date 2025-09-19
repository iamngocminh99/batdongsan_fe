import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = "http://localhost:8080/api/properties";

type PropertyType = "APARTMENT" | "HOUSE" | "LAND";
type SaleType = "SALE" | "RENT";
type Status = "DRAFT" | "PENDING" | "PUBLISHED" | "SOLD" | "RENTED";
type PriceType = "TOTAL" | "MONTHLY" | "WEEKLY";

interface Property {
    id?: string;
    title: string;
    description?: string;
    price: number;
    priceType: PriceType;
    bedrooms: number;
    bathrooms: number;
    livingRooms: number;
    totalRooms: number;
    propertyType: PropertyType;
    saleType: SaleType;
    street?: string;
    area?: string;
    fullAddress?: string;
    status: Status;
    floorAreaSqft?: number;
    landAreaSqft?: number;
    createdAt?: string;
    agent?: { id: string };
    imageUrl?: string;
}

export default function PropertyPage() {
    const { token, email } = useAuth();
    const [agentId, setAgentId] = useState<string | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [filterAddress, setFilterAddress] = useState("");

    const [filterTitle, setFilterTitle] = useState("");
    const [filterPropertyType, setFilterPropertyType] = useState<PropertyType | "">("");
    const [filterSaleType, setFilterSaleType] = useState<SaleType | "">("");
    const [filterStatus, setFilterStatus] = useState<Status | "">("");

    const [openDialog, setOpenDialog] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [form, setForm] = useState<Property>({
        title: "",
        description: "",
        price: 0,
        priceType: "TOTAL",
        bedrooms: 0,
        bathrooms: 0,
        livingRooms: 0,
        totalRooms: 0,
        propertyType: "APARTMENT",
        saleType: "SALE",
        status: "DRAFT",
        street: "",
        area: "",
        fullAddress: "",
        floorAreaSqft: undefined,
        landAreaSqft: undefined,
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    useEffect(() => {
        fetchData();
    }, [page, size, filterTitle, filterPropertyType, filterSaleType, filterStatus, filterAddress]);

    useEffect(() => {
        if (email) {
            axios
                .get("http://localhost:8080/api/agents/find-by-email", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { email },
                })
                .then((res) => {
                    setAgentId(res.data.id);
                });
        }
    }, [email, token]);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page,
                    size,
                    title: filterTitle,
                    propertyType: filterPropertyType || undefined,
                    saleType: filterSaleType || undefined,
                    status: filterStatus || undefined,
                    address: filterAddress || undefined,
                },
            });
            setProperties(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch {
            toast.error("Không thể tải danh sách property");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: keyof Property, value: string) => {
        setForm({ ...form, [name]: value } as Property);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                agent: agentId ? { id: agentId } : undefined,
            };

            let propertyId: string | undefined = editingProperty?.id;

            if (editingProperty) {
                // update
                await axios.put(`${API_URL}/${editingProperty.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                propertyId = editingProperty.id;
                toast.success("Cập nhật thành công");
            } else {
                // create
                const res = await axios.post(API_URL, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                propertyId = res.data.id;
                toast.success("Thêm mới thành công");
            }

            // Upload ảnh nếu có chọn
            if (propertyId && selectedFiles.length > 0) {
                const formData = new FormData();
                selectedFiles.forEach((file) => formData.append("files", file));
                await axios.post(`${API_URL}/${propertyId}/images`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            setOpenDialog(false);
            setEditingProperty(null);
            setSelectedFiles([]);
            fetchData();
        } catch {
            toast.error("Lỗi khi lưu property");
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm("Bạn có chắc chắn muốn xóa property này?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Xóa thành công");
            fetchData();
        } catch {
            toast.error("Lỗi khi xóa property");
        }
    };

    const openEditDialog = (p: Property) => {
        setEditingProperty(p);
        setForm({ ...p });
        setOpenDialog(true);
    };

    const openAddDialog = () => {
        setEditingProperty(null);
        setForm({
            title: "",
            description: "",
            price: 0,
            priceType: "TOTAL",
            bedrooms: 0,
            bathrooms: 0,
            livingRooms: 0,
            totalRooms: 0,
            propertyType: "APARTMENT",
            saleType: "SALE",
            status: "DRAFT",
            street: "",
            area: "",
            fullAddress: "",
            floorAreaSqft: undefined,
            landAreaSqft: undefined,
        });
        setSelectedFiles([]);
        setOpenDialog(true);
    };

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Quản lý Properties</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Filter */}
                    <div className="flex gap-4 mb-4">
                        <Input
                            placeholder="Tên..."
                            value={filterTitle}
                            onChange={(e) => setFilterTitle(e.target.value)}
                        />
                        <Input
                            placeholder="Địa chỉ..."
                            value={filterAddress}
                            onChange={(e) => setFilterAddress(e.target.value)}
                        />
                        <Select
                            value={filterPropertyType}
                            onValueChange={(val) => setFilterPropertyType(val as PropertyType | "")}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Loại BĐS" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Tất cả</SelectItem>
                                <SelectItem value="APARTMENT">Căn hộ</SelectItem>
                                <SelectItem value="HOUSE">Nhà</SelectItem>
                                <SelectItem value="LAND">Đất</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={filterSaleType}
                            onValueChange={(val) => setFilterSaleType(val as SaleType | "")}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Hình thức" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Tất cả</SelectItem>
                                <SelectItem value="SALE">Bán</SelectItem>
                                <SelectItem value="RENT">Thuê</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={filterStatus}
                            onValueChange={(val) => setFilterStatus(val as Status | "")}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Tất cả</SelectItem>
                                <SelectItem value="DRAFT">Nháp</SelectItem>
                                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                                <SelectItem value="PUBLISHED">Đã đăng</SelectItem>
                                <SelectItem value="SOLD">Đã bán</SelectItem>
                                <SelectItem value="RENTED">Đã thuê</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={fetchData}>Lọc</Button>
                        <Button onClick={openAddDialog}>+ Thêm mới</Button>
                    </div>

                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ảnh</TableHead>
                                <TableHead>Tên</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Loại BĐS</TableHead>
                                <TableHead>Hình thức</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Phòng ngủ</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead>Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {properties.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        {p.imageUrl ? (
                                            <img
                                                src={p.imageUrl}
                                                alt={p.title}
                                                className="w-20 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <span>Chưa có ảnh</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{p.title}</TableCell>
                                    <TableCell>{p.price}</TableCell>
                                    <TableCell>{p.propertyType}</TableCell>
                                    <TableCell>{p.saleType}</TableCell>
                                    <TableCell>{p.status}</TableCell>
                                    <TableCell>{p.bedrooms}</TableCell>
                                    <TableCell>
                                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size="sm" onClick={() => openEditDialog(p)}>
                                            Sửa
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            Xóa
                                        </Button>
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
                        <Button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Trang sau
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog Add/Edit */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProperty ? "Sửa Property" : "Thêm Property"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Tên</Label>
                            <Input name="title" value={form.title} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Giá</Label>
                            <Input name="price" type="number" value={form.price} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Loại giá</Label>
                            <Select value={form.priceType} onValueChange={(val) => handleSelectChange("priceType", val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TOTAL">Tổng</SelectItem>
                                    <SelectItem value="MONTHLY">Theo tháng</SelectItem>
                                    <SelectItem value="WEEKLY">Theo tuần</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Phòng ngủ</Label>
                            <Input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Phòng tắm</Label>
                            <Input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Tổng phòng</Label>
                            <Input name="totalRooms" type="number" value={form.totalRooms} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Loại BĐS</Label>
                            <Select value={form.propertyType} onValueChange={(val) => handleSelectChange("propertyType", val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="APARTMENT">Căn hộ</SelectItem>
                                    <SelectItem value="HOUSE">Nhà</SelectItem>
                                    <SelectItem value="LAND">Đất</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Hình thức</Label>
                            <Select value={form.saleType} onValueChange={(val) => handleSelectChange("saleType", val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SALE">Bán</SelectItem>
                                    <SelectItem value="RENT">Thuê</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Đường / Street</Label>
                            <Input name="street" value={form.street} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Khu vực / Area</Label>
                            <Input name="area" value={form.area} onChange={handleChange} />
                        </div>

                        <div className="col-span-2">
                            <Label>Địa chỉ đầy đủ</Label>
                            <Input name="fullAddress" value={form.fullAddress} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Diện tích sàn (m²)</Label>
                            <Input
                                name="floorAreaSqft"
                                type="number"
                                value={form.floorAreaSqft ?? ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Diện tích đất (m²)</Label>
                            <Input
                                name="landAreaSqft"
                                type="number"
                                value={form.landAreaSqft ?? ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Label>Trạng thái</Label>
                            <Select value={form.status} onValueChange={(val) => handleSelectChange("status", val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Nháp</SelectItem>
                                    <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                                    <SelectItem value="PUBLISHED">Đã đăng</SelectItem>
                                    <SelectItem value="SOLD">Đã bán</SelectItem>
                                    <SelectItem value="RENTED">Đã thuê</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2">
                            <Label>Mô tả</Label>
                            <Input name="description" value={form.description} onChange={handleChange} />
                        </div>
                        <div className="col-span-2">
                            <Label>Ảnh bất động sản</Label>
                            <Input
                                type="file"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
                                        e.target.value = ""; // reset để lần sau có thể chọn lại file trùng
                                    }
                                }}
                            />

                            {/* Danh sách file đã chọn */}
                            <ul className="mt-2 space-y-1">
                                {selectedFiles.map((file, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center border p-2 rounded"
                                    >
                                        <span className="text-sm">{file.name}</span>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
                                            }
                                        >
                                            Xóa
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="col-span-2">
                            <Button onClick={handleSubmit} className="w-full">
                                {editingProperty ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
