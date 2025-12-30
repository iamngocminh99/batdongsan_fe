import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
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
import { decodeToken } from "@/utils/jwt";

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
    ward?: string;
    city?: string;
    fullAddress?: string;

    status: Status;
    floorAreaSqft?: number;
    landAreaSqft?: number;
    createdAt?: string;
    direction?: "NORTH" | "SOUTH" | "EAST" | "WEST" | "NORTHEAST" | "SOUTHEAST" | "SOUTHWEST" | "NORTHWEST";
    latitude?: number;
    longitude?: number;

    imageUrl?: string;
    user?: { id: string };
}

export default function PropertyuserPage() {
    const { token } = useAuth();
    const [userId, setUserId] = useState<string | null>(null);

    const [properties, setProperties] = useState<Property[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [filterDirection, setFilterDirection] = useState<"" | "NORTH" | "SOUTH" | "EAST" | "WEST" | "NORTHEAST" | "SOUTHEAST" | "SOUTHWEST" | "NORTHWEST">("");


    // Filters
    const [filterAddress, setFilterAddress] = useState("");
    const [filterTitle, setFilterTitle] = useState("");
    const [filterPropertyType, setFilterPropertyType] = useState<PropertyType | "">("");
    const [filterSaleType, setFilterSaleType] = useState<SaleType | "">("");
    const [filterStatus, setFilterStatus] = useState<Status | "">("");

    // Dialog & form
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [viewProperty, setViewProperty] = useState<Property | null>(null);

    const openViewDialogHandler = (p: Property) => {
        setViewProperty(p);
        setOpenViewDialog(true);
    };

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
        ward: "",
        city: "",
        fullAddress: "",
        floorAreaSqft: undefined,
        landAreaSqft: undefined,
        direction: undefined,
        latitude: undefined,
        longitude: undefined,
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // ====== DỮ LIỆU TỈNH/PHƯỜNG (autocomplete, đã bỏ district) ======
    const [locData, setLocData] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [suggestCities, setSuggestCities] = useState<string[]>([]);
    const [suggestWards, setSuggestWards] = useState<string[]>([]);

    const [priceDisplay, setPriceDisplay] = useState("");

    // Gọi API hành chính VN depth=3 (1 lần)
    useEffect(() => {
        let mounted = true;
        axios
            .get("https://provinces.open-api.vn/api/?depth=3")
            .then((res) => {
                if (!mounted) return;
                setLocData(res.data || []);
            })
            .catch(() => {
                toast.error("Không tải được danh sách tỉnh/thành");
            });
        return () => {
            mounted = false;
        };
    }, []);

    // Khi chọn city -> gộp TẤT CẢ wards từ mọi quận trong city, reset ward
    useEffect(() => {
        const found = locData.find((p: any) => p.name === form.city);
        if (found) {
            const allWards = (found.districts || []).flatMap((d: any) => d.wards || []);
            setWards(allWards);

            // chỉ reset ward nếu đang thêm mới (không phải đang sửa)
            if (!editingProperty && !allWards.find((w: any) => w.name === form.ward)) {
                setForm((prev) => ({ ...prev, ward: "" }));
            }
        } else {
            setWards([]);
        }
    }, [form.city, locData, editingProperty]);


    const filterSuggest = (val: string, list: any[], take = 8) =>
        list
            .filter((x: any) => String(x.name || x).toLowerCase().includes(val.trim().toLowerCase()))
            .map((x: any) => String(x.name || x))
            .slice(0, take);

    // Parse số an toàn
    const numericKeys = new Set([
        "price",
        "bedrooms",
        "bathrooms",
        "livingRooms",
        "totalRooms",
        "floorAreaSqft",
        "landAreaSqft",
        "latitude",
        "longitude",
    ]);

    const formatVND = (value: string) => {
        const numeric = value.replace(/\D/g, "");
        return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };


    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numeric = e.target.value.replace(/\D/g, "");

        setForm((prev) => ({
            ...prev,
            price: numeric ? Number(numeric) : 0,
        }));

        setPriceDisplay(numeric);
    };

    const handlePriceBlur = () => {
        if (!form.price) {
            setPriceDisplay("");
            return;
        }
        setPriceDisplay(form.price.toLocaleString("vi-VN"));
    };

    const handlePriceFocus = () => {
        setPriceDisplay(form.price ? String(form.price) : "");
    };

    // Lấy userId từ token
    useEffect(() => {
        if (token) {
            const decoded: any = decodeToken(token);
            if (decoded?.id) {
                setUserId(decoded.id);
            }
        }
    }, [token]);

    // Load danh sách theo filter
    useEffect(() => {
        if (userId) fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, page, size, filterTitle, filterPropertyType, filterSaleType, filterStatus, filterAddress]);

    const fetchData = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API_URL}/user/${userId}/search`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page,
                    size,
                    title: filterTitle || undefined,
                    propertyType: filterPropertyType || undefined,
                    saleType: filterSaleType || undefined,
                    status: filterStatus || undefined,
                    direction: filterDirection || undefined,
                    address: filterAddress || undefined, // BE sẽ match street/ward/city/fullAddress
                },
            });
            setProperties(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (err) {
            console.error("fetchData error:", err);
            toast.error("Không thể tải danh sách property");
        }
    };

    const resetForm = () => {
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
            ward: "",
            city: "",
            fullAddress: "",
            floorAreaSqft: undefined,
            landAreaSqft: undefined,
        });

        setPriceDisplay("");
        setSelectedFiles([]);
        setWards([]);
        setSuggestCities([]);
        setSuggestWards([]);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (numericKeys.has(name)) {
            const parsed = value === "" ? undefined : Number(value);
            setForm((prev) => ({ ...prev, [name]: parsed } as Property));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: keyof Property, value: string) => {
        setForm((prev) => ({ ...prev, [name]: value } as Property));
    };

    const buildFormData = (data: Property, userId?: string | null) => {
        const fd = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                fd.append(key, String(value));
            }
        });
        if (userId) fd.append("userId", userId);
        selectedFiles.forEach((file) => fd.append("files", file));
        return fd;
    };

    const handleSubmit = async () => {
        try {
            const formData = buildFormData(form, userId);
            if (editingProperty) {
                await axios.put(`${API_URL}/${editingProperty.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                toast.success("Cập nhật thành công");
            } else {
                await axios.post(API_URL, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                toast.success("Thêm mới thành công");
            }
            setOpenDialog(false);
            setEditingProperty(null);
            resetForm();
            fetchData();
        } catch (err: any) {
            console.error("handleSubmit error:", err);
            const msg = err?.response?.data
                ? typeof err.response.data === "string"
                    ? err.response.data
                    : JSON.stringify(err.response.data)
                : "Lỗi khi lưu property (network hoặc không xác định)";
            toast.error(msg);
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
        const foundCity = locData.find((c: any) => c.name === p.city);
        const allWards = foundCity
            ? (foundCity.districts || []).flatMap((d: any) => d.wards || [])
            : [];

        setWards(allWards);

        setTimeout(() => {
            setEditingProperty(p);
            setForm({
                ...p,
                floorAreaSqft: p.floorAreaSqft ?? undefined,
                landAreaSqft: p.landAreaSqft ?? undefined,
            });

            setPriceDisplay(
                p.price ? p.price.toLocaleString("vi-VN") : ""
            );

            setSuggestCities([]);
            setSuggestWards([]);
            setSelectedFiles([]);
            setOpenDialog(true);
        }, 0);

    };


    const openAddDialog = () => {
        setEditingProperty(null);
        resetForm();
        setPriceDisplay("");
        setOpenDialog(true);
    };

    return (
        <div className="">
            <Card className="shadow-none border-none bg-transparent rounded-none">
                <CardHeader>
                    <CardTitle>Quản lý Bất động sản của bạn</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Filter */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        <Input
                            placeholder="Tên..."
                            value={filterTitle}
                            onChange={(e) => setFilterTitle(e.target.value)}
                            className="w-[220px]"
                        />
                        <Input
                            placeholder="Địa chỉ (từ khóa)..."
                            value={filterAddress}
                            onChange={(e) => setFilterAddress(e.target.value)}
                            className="w-[240px]"
                        />
                        <Select
                            value={filterPropertyType}
                            onValueChange={(val) => setFilterPropertyType(val as PropertyType | "")}
                        >
                            <SelectTrigger className="w-[160px]">
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
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Hình thức" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Tất cả</SelectItem>
                                <SelectItem value="SALE">Bán</SelectItem>
                                <SelectItem value="RENT">Thuê</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filterDirection}
                            onValueChange={(val) => setFilterDirection(val as any)}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Hướng nhà" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Tất cả</SelectItem>
                                <SelectItem value="NORTH">Bắc</SelectItem>
                                <SelectItem value="SOUTH">Nam</SelectItem>
                                <SelectItem value="EAST">Đông</SelectItem>
                                <SelectItem value="WEST">Tây</SelectItem>
                                <SelectItem value="NORTHEAST">Đông Bắc</SelectItem>
                                <SelectItem value="SOUTHEAST">Đông Nam</SelectItem>
                                <SelectItem value="SOUTHWEST">Tây Nam</SelectItem>
                                <SelectItem value="NORTHWEST">Tây Bắc</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button className="bg-orange-400 cursor-pointer" onClick={() => { setPage(0); fetchData(); }}>Lọc</Button>
                        <Button className="bg-orange-400 cursor-pointer" onClick={openAddDialog}>+ Thêm mới</Button>
                    </div>

                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ảnh</TableHead>
                                <TableHead>Tên</TableHead>
                                <TableHead>Giá</TableHead>
                                <TableHead>Loại BĐS</TableHead>
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
                                    <TableCell className="max-w-[220px] truncate">{p.title}</TableCell>
                                    <TableCell>{(p as any).price?.toLocaleString?.() || p.price}</TableCell>
                                    <TableCell>{p.propertyType}</TableCell>

                                    <TableCell className="space-x-2">
                                        <Button className="bg-yellow-400 cursor-pointer" size="sm" variant="secondary" onClick={() => openViewDialogHandler(p)}>
                                            <FaEye className="" />
                                        </Button>
                                        <Button className="bg-orange-400 cursor-pointer" size="sm" onClick={() => openEditDialog(p)}>
                                            <FiEdit />
                                        </Button>
                                        <Button
                                            className="cursor-pointer"
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            <FaTrashAlt />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                            <span>Kích thước trang:</span>
                            <Select
                                value={String(size)}
                                onValueChange={(v) => {
                                    setSize(Number(v));
                                    setPage(0);
                                }}
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
                                Trang trước
                            </Button>
                            <span>
                                Trang {page + 1} / {Math.max(totalPages, 1)}
                            </span>
                            <Button
                                disabled={page + 1 >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Trang sau
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Dialog Add/Edit */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProperty ? "Sửa Bất động sản" : "Thêm Bất động sản"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Tên</Label>
                            <Input name="title" value={form.title} onChange={handleChange} />
                        </div>
                        <Input
                            value={priceDisplay}
                            onChange={handlePriceChange}
                            onBlur={handlePriceBlur}
                            onFocus={handlePriceFocus}
                            placeholder="1.000.000"
                            inputMode="numeric"
                        />

                        <div>
                            <Label>Loại giá</Label>
                            <Select
                                value={form.priceType}
                                onValueChange={(val) => handleSelectChange("priceType", val)}
                            >
                                <SelectTrigger><SelectValue placeholder="Chọn" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TOTAL">Tổng</SelectItem>
                                    <SelectItem value="MONTHLY">Theo tháng</SelectItem>
                                    <SelectItem value="WEEKLY">Theo tuần</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Phòng ngủ</Label>
                            <Input name="bedrooms" type="number" value={form.bedrooms ?? ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Phòng tắm</Label>
                            <Input name="bathrooms" type="number" value={form.bathrooms ?? ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Phòng khách</Label>
                            <Input name="livingRooms" type="number" value={form.livingRooms ?? ""} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Tổng phòng</Label>
                            <Input name="totalRooms" type="number" value={form.totalRooms ?? ""} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Loại BĐS</Label>
                            <Select
                                value={form.propertyType}
                                onValueChange={(val) => handleSelectChange("propertyType", val)}
                            >
                                <SelectTrigger><SelectValue placeholder="Chọn" /></SelectTrigger>
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
                                <SelectTrigger><SelectValue placeholder="Chọn" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SALE">Bán</SelectItem>
                                    <SelectItem value="RENT">Thuê</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* ======= ĐỊA CHỈ + AUTOCOMPLETE ======= */}
                        <div className="relative">
                            <Label>Tỉnh / Thành phố</Label>
                            <Input
                                name="city"
                                value={form.city ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setForm((prev) => ({ ...prev, city: val }));
                                    setSuggestCities(filterSuggest(val, locData));
                                }}
                            />
                            {suggestCities.length > 0 && (
                                <ul className="absolute z-20 bg-white border rounded-md mt-1 w-full shadow-md max-h-64 overflow-auto">
                                    {suggestCities.map((name) => (
                                        <li
                                            key={name}
                                            className="px-3 py-2 hover:bg-green-50 cursor-pointer"
                                            onClick={() => {
                                                setForm((prev) => ({ ...prev, city: name, ward: "" }));
                                                setSuggestCities([]);
                                            }}
                                        >
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="relative">
                            <Label>Phường / Xã</Label>
                            <Input
                                name="ward"
                                value={form.ward ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setForm((prev) => ({ ...prev, ward: val }));
                                    setSuggestWards(filterSuggest(val, wards));
                                }}
                                disabled={!form.city}
                            />
                            {suggestWards.length > 0 && (
                                <ul className="absolute z-20 bg-white border rounded-md mt-1 w-full shadow-md max-h-64 overflow-auto">
                                    {suggestWards.map((name) => (
                                        <li
                                            key={name}
                                            className="px-3 py-2 hover:bg-green-50 cursor-pointer"
                                            onClick={() => {
                                                setForm((prev) => ({ ...prev, ward: name }));
                                                setSuggestWards([]);
                                            }}
                                        >
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div>
                            <Label>Đường / Số nhà</Label>
                            <Input name="street" value={form.street ?? ""} onChange={handleChange} />
                        </div>

                        <div className="col-span-2">
                            <Label>Địa chỉ đầy đủ (tự động nếu bỏ trống)</Label>
                            <Input name="fullAddress" value={form.fullAddress ?? ""} onChange={handleChange} />
                        </div>
                        {/* ======= END ĐỊA CHỈ ======= */}

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
                            <Label>Hướng nhà</Label>
                            <Select
                                value={form.direction || ""}
                                onValueChange={(val) => handleSelectChange("direction", val)}
                            >
                                <SelectTrigger><SelectValue placeholder="Chọn hướng" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NORTH">Bắc</SelectItem>
                                    <SelectItem value="SOUTH">Nam</SelectItem>
                                    <SelectItem value="EAST">Đông</SelectItem>
                                    <SelectItem value="WEST">Tây</SelectItem>
                                    <SelectItem value="NORTHEAST">Đông Bắc</SelectItem>
                                    <SelectItem value="SOUTHEAST">Đông Nam</SelectItem>
                                    <SelectItem value="SOUTHWEST">Tây Nam</SelectItem>
                                    <SelectItem value="NORTHWEST">Tây Bắc</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Vĩ độ (Latitude)</Label>
                            <Input
                                name="latitude"
                                type="number"
                                step="any"
                                value={form.latitude ?? ""}
                                onChange={handleChange}
                                placeholder="10.762622"
                            />
                        </div>

                        <div>
                            <Label>Kinh độ (Longitude)</Label>
                            <Input
                                name="longitude"
                                type="number"
                                step="any"
                                value={form.longitude ?? ""}
                                onChange={handleChange}
                                placeholder="106.660172"
                            />
                        </div>

                        <div>
                            <Label>Trạng thái</Label>
                            <Select value={form.status} onValueChange={(val) => handleSelectChange("status", val)}>
                                <SelectTrigger><SelectValue placeholder="Chọn" /></SelectTrigger>
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
                            <Input name="description" value={form.description ?? ""} onChange={handleChange} />
                        </div>

                        {/* Upload ảnh */}
                        <div className="col-span-2">
                            <Label>Ảnh bất động sản</Label>
                            <Input
                                type="file"
                                multiple
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                                        e.target.value = "";
                                    }
                                }}
                            />
                            <ul className="mt-2 space-y-1">
                                {selectedFiles.map((file, index) => (
                                    <li key={index} className="flex justify-between items-center border p-2 rounded">
                                        <span className="text-sm">{file.name}</span>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
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

            {/* Dialog xem chi tiết */}
            <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-primary">Chi tiết bất động sản</DialogTitle>
                    </DialogHeader>

                    {viewProperty ? (
                        <div className="space-y-6">
                            {/* Ảnh chính */}
                            <div className="flex justify-center">
                                {viewProperty.imageUrl ? (
                                    <img
                                        src={viewProperty.imageUrl}
                                        alt="Ảnh"
                                        className="w-[400px] h-[280px] object-cover rounded-xl border shadow-sm"
                                    />
                                ) : (
                                    <div className="w-[400px] h-[280px] flex items-center justify-center border rounded-xl text-gray-400">
                                        Không có ảnh
                                    </div>
                                )}
                            </div>

                            {/* Thông tin chi tiết */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm">
                                {[
                                    ["Tên", viewProperty.title],
                                    ["Giá", `${viewProperty.price?.toLocaleString?.() || viewProperty.price} ${viewProperty.priceType === "MONTHLY"
                                        ? "/tháng"
                                        : viewProperty.priceType === "WEEKLY"
                                            ? "/tuần"
                                            : ""
                                        }`],
                                    ["Loại BĐS", viewProperty.propertyType],
                                    ["Hình thức", viewProperty.saleType],
                                    ["Trạng thái", viewProperty.status],
                                    ["Hướng nhà", viewProperty.direction || "—"],
                                    ["Phòng ngủ", viewProperty.bedrooms],
                                    ["Phòng tắm", viewProperty.bathrooms],
                                    ["Phòng khách", viewProperty.livingRooms],
                                    ["Tổng phòng", viewProperty.totalRooms],
                                    ["Diện tích sàn (m²)", viewProperty.floorAreaSqft || "—"],
                                    ["Diện tích đất (m²)", viewProperty.landAreaSqft || "—"],
                                    ["Vĩ độ (Latitude)", viewProperty.latitude || "—"],
                                    ["Kinh độ (Longitude)", viewProperty.longitude || "—"],
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{label}</p>
                                        <p className="text-base font-medium text-gray-900">{value}</p>
                                    </div>
                                ))}

                                <div className="col-span-2">
                                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Địa chỉ</p>
                                    <p className="text-base font-medium text-gray-900">
                                        {viewProperty.fullAddress ||
                                            [viewProperty.street, viewProperty.ward, viewProperty.city].filter(Boolean).join(", ")}
                                    </p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Mô tả</p>
                                    <p className="text-base text-gray-800 whitespace-pre-line">
                                        {viewProperty.description || "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Đang tải...</p>
                    )}
                </DialogContent>
            </Dialog>


        </div>
    );
}
