import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BottomNavigation } from "./component/BottomNavigation";

export default function SearchPage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const initialKeyword = params.get("keyword") || "";

    const [tab, setTab] = useState<"SALE" | "RENT" | "PROJECT">("SALE");
    const [keyword, setKeyword] = useState(initialKeyword);
    const [address, setAddress] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minBedrooms, setMinBedrooms] = useState("");
    const [maxBedrooms, setMaxBedrooms] = useState("");
    const [floorAreaSqft, setFloorAreaSqft] = useState("");
    const [landAreaSqft, setLandAreaSqft] = useState("");

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/properties", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                params: {
                    title: keyword || undefined,
                    address: address || undefined,
                    propertyType: propertyType || undefined,
                    saleType: tab !== "PROJECT" ? tab : undefined,
                    minPrice: minPrice || undefined,
                    maxPrice: maxPrice || undefined,
                    minBedrooms: minBedrooms || undefined,
                    maxBedrooms: maxBedrooms || undefined,
                    floorAreaSqft: floorAreaSqft || undefined,
                    landAreaSqft: landAreaSqft || undefined,
                    page: 0,
                    size: 10,
                },
            });
            setResults(res.data.content);
        } catch {
            toast.error("Không thể tải kết quả tìm kiếm");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (initialKeyword) {
            handleSearch();
        }
    }, [initialKeyword]);

    return (
        <div className="p-6 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b mb-4">
                <button
                    className={`pb-2 ${tab === "SALE" ? "border-b-2 border-red-500 font-bold" : ""}`}
                    onClick={() => setTab("SALE")}
                >
                    Nhà đất bán
                </button>
                <button
                    className={`pb-2 ${tab === "RENT" ? "border-b-2 border-red-500 font-bold" : ""}`}
                    onClick={() => setTab("RENT")}
                >
                    Nhà đất cho thuê
                </button>
                <button
                    className={`pb-2 ${tab === "PROJECT" ? "border-b-2 border-red-500 font-bold" : ""}`}
                    onClick={() => setTab("PROJECT")}
                >
                    Dự án
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                    placeholder="Tên bất động sản"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <Input
                    placeholder="Địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Loại BĐS" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="APARTMENT">Căn hộ</SelectItem>
                        <SelectItem value="HOUSE">Nhà</SelectItem>
                        <SelectItem value="LAND">Đất</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    type="number"
                    placeholder="Giá từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Giá đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Phòng ngủ từ"
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Phòng ngủ đến"
                    value={maxBedrooms}
                    onChange={(e) => setMaxBedrooms(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Diện tích sàn (m²)"
                    value={floorAreaSqft}
                    onChange={(e) => setFloorAreaSqft(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Diện tích đất (m²)"
                    value={landAreaSqft}
                    onChange={(e) => setLandAreaSqft(e.target.value)}
                />
            </div>

            <Button
                onClick={handleSearch}
                className="bg-red-500 hover:bg-red-600 text-white w-full h-12"
                disabled={loading}
            >
                {loading ? "Đang tìm..." : "Tìm kiếm"}
            </Button>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {results.map((property) => (
                    <div key={property.id} className="border rounded-lg overflow-hidden shadow">
                        <img
                            src={property.imageUrl || "/placeholder.svg"}
                            alt={property.title}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                            <h4 className="font-bold">{property.title}</h4>
                            <p className="text-sm text-gray-500">{property.fullAddress}</p>
                            <p className="text-red-500 font-bold">{property.price} VNĐ</p>
                            <p className="text-sm">
                                {property.bedrooms} PN • {property.bathrooms} PT •{" "}
                                {property.floorAreaSqft || 0} m²
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <BottomNavigation />
        </div>
    );
}
