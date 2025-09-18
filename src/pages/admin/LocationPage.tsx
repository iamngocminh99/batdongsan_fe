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

const API_URL = "http://localhost:8080/api/locations";

type LocationType = "WARD" | "DISTRICT" | "CITY" | "REGION";

interface Location {
    id?: string;
    name: string;
    type: LocationType;
    country: string;
    latitude?: number;
    longitude?: number;
}

export default function LocationPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [filterName, setFilterName] = useState("");
    const [filterType, setFilterType] = useState<LocationType | "">("");
    const [filterCountry, setFilterCountry] = useState("");

    const { token } = useAuth();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [form, setForm] = useState<Location>({
        name: "",
        type: "CITY",
        country: "Việt Nam",
        latitude: undefined,
        longitude: undefined,
    });

    // Load data
    useEffect(() => {
        fetchData();
    }, [page, size, filterName, filterType, filterCountry]);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page,
                    size,
                    name: filterName,
                    type: filterType || undefined,
                    country: filterCountry,
                },
            });
            setLocations(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            toast.error("Không thể tải danh sách location");
        }
    };

    // Handle form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setForm({ ...form, type: value as LocationType });
    };

    const handleSubmit = async () => {
        try {
            if (editingLocation) {
                await axios.put(`${API_URL}/${editingLocation.id}`, form, {
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
            setEditingLocation(null);
            fetchData();
        } catch (err) {
            toast.error("Lỗi khi lưu location");
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Xóa thành công");
            fetchData();
        } catch (err) {
            toast.error("Lỗi khi xóa location");
        }
    };

    const openEditDialog = (loc: Location) => {
        setEditingLocation(loc);
        setForm({ ...loc });
        setOpenDialog(true);
    };

    const openAddDialog = () => {
        setEditingLocation(null);
        setForm({
            name: "",
            type: "CITY",
            country: "Việt Nam",
            latitude: undefined,
            longitude: undefined,
        });
        setOpenDialog(true);
    };

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Quản lý Location</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Filter */}
                    <div className="flex gap-4 mb-4">
                        <Input
                            placeholder="Tên..."
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                        <Input
                            placeholder="Quốc gia..."
                            value={filterCountry}
                            onChange={(e) => setFilterCountry(e.target.value)}
                        />
                        <Select onValueChange={(val) => setFilterType(val as LocationType | "")}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Loại" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tất cả">Tất cả</SelectItem>
                                <SelectItem value="WARD">Phường</SelectItem>
                                <SelectItem value="DISTRICT">Quận/Huyện</SelectItem>
                                <SelectItem value="CITY">Thành phố</SelectItem>
                                <SelectItem value="REGION">Vùng</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={fetchData}>Lọc</Button>
                        <Button onClick={openAddDialog}>+ Thêm mới</Button>
                    </div>

                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Quốc gia</TableHead>
                                <TableHead>Lat</TableHead>
                                <TableHead>Lng</TableHead>
                                <TableHead>Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.map((loc) => (
                                <TableRow key={loc.id}>
                                    <TableCell>{loc.name}</TableCell>
                                    <TableCell>{loc.type}</TableCell>
                                    <TableCell>{loc.country}</TableCell>
                                    <TableCell>{loc.latitude}</TableCell>
                                    <TableCell>{loc.longitude}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button size="sm" onClick={() => openEditDialog(loc)}>
                                            Sửa
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(loc.id)}>
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
                        <DialogTitle>{editingLocation ? "Sửa Location" : "Thêm Location"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Tên</Label>
                            <Input name="name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label>Loại</Label>
                            <Select value={form.type} onValueChange={handleSelectChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WARD">Phường</SelectItem>
                                    <SelectItem value="DISTRICT">Quận/Huyện</SelectItem>
                                    <SelectItem value="CITY">Thành phố</SelectItem>
                                    <SelectItem value="REGION">Vùng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Quốc gia</Label>
                            <Input name="country" value={form.country} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Latitude</Label>
                            <Input name="latitude" type="number" value={form.latitude || ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Longitude</Label>
                            <Input name="longitude" type="number" value={form.longitude || ""} onChange={handleChange} />
                        </div>
                        <Button onClick={handleSubmit} className="w-full">
                            {editingLocation ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
