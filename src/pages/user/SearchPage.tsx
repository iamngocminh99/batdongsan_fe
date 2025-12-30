import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "./component/BottomNavigation";

function LocationSelector({
    value,
    onChange,
}: {
    value?: { province?: string; ward?: string };
    onChange: (loc: { province: string; ward: string }) => void;
}) {
    const [data, setData] = useState<any[]>([]);
    const [province, setProvince] = useState(value?.province || "");
    const [ward, setWard] = useState(value?.ward || "");
    const [wards, setWards] = useState<any[]>([]);
    const [suggestProvinces, setSuggestProvinces] = useState<string[]>([]);
    const [suggestWards, setSuggestWards] = useState<string[]>([]);

    useEffect(() => {
        let mounted = true;
        axios
            .get("https://provinces.open-api.vn/api/?depth=3")
            .then((res) => {
                if (!mounted) return;
                setData(res.data || []);
            })
            .catch(() => {
                toast.error("Không tải được danh sách tỉnh/thành");
            });
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const found = data.find((p: any) => p.name === province);
        if (found) {
            const allWards = (found.districts || []).flatMap((d: any) => d.wards || []);
            setWards(allWards);
            setWard("");
        } else {
            setWards([]);
            setWard("");
        }
    }, [province, data]);

    useEffect(() => {
        onChange({ province, ward });
    }, [province, ward, onChange]);

    const filterSuggest = (val: string, list: any[], take = 8) =>
        list
            .filter((x: any) =>
                String(x.name || x).toLowerCase().includes(val.trim().toLowerCase())
            )
            .map((x: any) => String(x.name || x))
            .slice(0, take);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Tỉnh / Thành phố</label>
                <Input
                    placeholder="Chọn tỉnh/thành"
                    value={province}
                    onChange={(e) => {
                        const val = e.target.value;
                        setProvince(val);
                        setSuggestProvinces(filterSuggest(val, data));
                    }}
                    className="h-10"
                />
                {suggestProvinces.length > 0 && (
                    <ul className="absolute z-30 bg-white border border-gray-200 rounded-md mt-1 w-full shadow-lg max-h-60 overflow-auto">
                        {suggestProvinces.map((name) => (
                            <li
                                key={name}
                                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                onClick={() => {
                                    setProvince(name);
                                    setSuggestProvinces([]);
                                }}
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="relative">
                <label className="text-xs font-medium text-gray-600 mb-1 block">Phường / Xã</label>
                <Input
                    placeholder="Chọn phường/xã"
                    value={ward}
                    disabled={!province}
                    onChange={(e) => {
                        const val = e.target.value;
                        setWard(val);
                        setSuggestWards(filterSuggest(val, wards));
                    }}
                    className="h-10"
                />
                {suggestWards.length > 0 && (
                    <ul className="absolute z-30 bg-white border border-gray-200 rounded-md mt-1 w-full shadow-lg max-h-60 overflow-auto">
                        {suggestWards.map((name) => (
                            <li
                                key={name}
                                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                onClick={() => {
                                    setWard(name);
                                    setSuggestWards([]);
                                }}
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export { LocationSelector };

export default function SearchPage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const initialKeyword = params.get("keyword") || "";
    const navigate = useNavigate();

    // Search filters
    const [saleType, setSaleType] = useState<"SALE" | "RENT">("SALE");
    const [propertyType, setPropertyType] = useState<string>("");
    const [keyword, setKeyword] = useState(initialKeyword);
    const [address, setAddress] = useState("");
    const [direction, setDirection] = useState<string>("");
    const [city, setCity] = useState("");
    const [ward, setWard] = useState("");
    const [street, setStreet] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minBedrooms, setMinBedrooms] = useState("");
    const [maxBedrooms, setMaxBedrooms] = useState("");

    // Results
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const [titleSugs, setTitleSugs] = useState<string[]>([]);
    const [showTitleSugs, setShowTitleSugs] = useState(false);

    useEffect(() => {
        const q = keyword.trim();
        if (q.length < 2) {
            setTitleSugs([]);
            setShowTitleSugs(false);
            return;
        }

        const t = setTimeout(async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/properties", {
                    params: {
                        title: q,
                        page: 0,
                        size: 5,
                        status: "PUBLISHED",
                    },
                });

                const raw = Array.isArray(res?.data?.content)
                    ? res.data.content
                    : Array.isArray(res?.data)
                        ? res.data
                        : [];

                const titles: string[] = Array.from(
                    new Set(
                        raw
                            .map((p: any) => (p?.title != null ? String(p.title) : ""))
                            .filter((t: string) => t.length > 0)
                    )
                );

                setTitleSugs(titles);
                setShowTitleSugs(titles.length > 0);
            } catch (e) {
                setTitleSugs([]);
                setShowTitleSugs(false);
            }
        }, 250);

        return () => clearTimeout(t);
    }, [keyword]);

    // Search function
    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/properties", {
                params: {
                    title: keyword || undefined,
                    propertyType: propertyType || undefined,
                    direction: direction || undefined,
                    saleType: saleType,
                    address: address || undefined,
                    city: city || undefined,
                    ward: ward || undefined,
                    street: street || undefined,
                    minPrice: minPrice || undefined,
                    maxPrice: maxPrice || undefined,
                    minBedrooms: propertyType !== "LAND" ? (minBedrooms || undefined) : undefined,
                    maxBedrooms: propertyType !== "LAND" ? (maxBedrooms || undefined) : undefined,
                    page: 0,
                    size: 12,
                },
            });
            setResults(res.data.content || []);
        } catch (err) {
            console.error(err);
            toast.error("Không thể tải kết quả tìm kiếm");
        } finally {
            setLoading(false);
        }
    };

    // Auto-search nếu có keyword từ URL
    useEffect(() => {
        if (initialKeyword) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialKeyword]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Search */}
            <div className="bg-gradient-to-r from-gray-400 to-gray-700 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-2">Tìm kiếm bất động sản</h1>
                    <p className="text-gray-100 mb-6">Khám phá hàng ngàn căn hộ, nhà ở và đất nền phù hợp với bạn</p>

                    {/* Main Search Bar */}
                    <div className="bg-white rounded-lg shadow-xl p-2">
                        <div className="flex flex-col lg:flex-row gap-2">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Nhập tên bất động sản, địa điểm..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onFocus={() => titleSugs.length > 0 && setShowTitleSugs(true)}
                                    onBlur={() => setTimeout(() => setShowTitleSugs(false), 150)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                                    className="h-12 text-gray-800 border-0 focus:ring-0"
                                />
                                {showTitleSugs && titleSugs.length > 0 && (
                                    <ul className="absolute z-40 bg-white border border-gray-200 rounded-md mt-1 w-full shadow-lg max-h-64 overflow-auto">
                                        {titleSugs.map((t) => (
                                            <li
                                                key={t}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                                                onMouseDown={() => {
                                                    setKeyword(t);
                                                    setShowTitleSugs(false);
                                                }}
                                            >
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <Button
                                onClick={handleSearch}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 font-medium"
                                disabled={loading}
                            >
                                {loading ? "Đang tìm..." : "Tìm kiếm"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    {/* Sale/Rent Toggle */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                            <Button
                                variant={saleType === "SALE" ? "default" : "outline"}
                                className={`rounded-lg px-6 py-2 font-medium transition-all ${saleType === "SALE"
                                    ? "bg-gray-600 text-white shadow-md"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                    }`}
                                onClick={() => setSaleType("SALE")}
                            >
                                Mua bán
                            </Button>
                            <Button
                                variant={saleType === "RENT" ? "default" : "outline"}
                                className={`rounded-lg px-6 py-2 font-medium transition-all ${saleType === "RENT"
                                    ? "bg-gray-600 text-white shadow-md"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                    }`}
                                onClick={() => setSaleType("RENT")}
                            >
                                Cho thuê
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="text-gray-600 hover:text-gray-700"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            {showAdvancedFilters ? "Ẩn bộ lọc" : "Bộ lọc nâng cao"}
                        </Button>
                    </div>

                    {/* Quick Filters */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: "Tất cả", value: "", icon: null },
                            { label: "Căn hộ", value: "APARTMENT", icon: "🏢" },
                            { label: "Nhà ở", value: "HOUSE", icon: "🏠" },
                            { label: "Đất", value: "LAND", icon: "🌳" },
                        ].map((item) => (
                            <Button
                                key={item.value}
                                variant={propertyType === item.value ? "default" : "outline"}
                                size="sm"
                                className={`rounded-full transition-all ${propertyType === item.value
                                    ? "bg-gray-600 text-white shadow-sm"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                    }`}
                                onClick={() => setPropertyType(item.value)}
                            >
                                {item.icon && <span className="mr-1">{item.icon}</span>}
                                {item.label}
                            </Button>
                        ))}
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Địa chỉ */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Địa chỉ cụ thể</label>
                                    <Input
                                        placeholder="Số nhà, tên đường..."
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="h-10"
                                    />
                                </div>

                                {/* Khu vực */}
                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Khu vực</label>
                                    <LocationSelector
                                        value={{ province: city, ward }}
                                        onChange={({ province, ward }) => {
                                            setCity(province);
                                            setWard(ward);
                                        }}
                                    />
                                </div>

                                {/* Đường */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Đường</label>
                                    <Input
                                        placeholder="Tên đường"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                        className="h-10"
                                    />
                                </div>

                                {/* Khoảng giá */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Khoảng giá (VNĐ)</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Giá từ"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="h-10"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Giá đến"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="h-10"
                                        />
                                    </div>
                                </div>

                                {/* Phòng ngủ */}
                                {propertyType !== "LAND" && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Số phòng ngủ</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Từ"
                                                value={minBedrooms}
                                                onChange={(e) => setMinBedrooms(e.target.value)}
                                                className="h-10"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Đến"
                                                value={maxBedrooms}
                                                onChange={(e) => setMaxBedrooms(e.target.value)}
                                                className="h-10"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Hướng */}
                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Hướng</label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { label: "Bắc", value: "NORTH" },
                                            { label: "Đông Bắc", value: "NORTHEAST" },
                                            { label: "Đông", value: "EAST" },
                                            { label: "Đông Nam", value: "SOUTHEAST" },
                                            { label: "Nam", value: "SOUTH" },
                                            { label: "Tây Nam", value: "SOUTHWEST" },
                                            { label: "Tây", value: "WEST" },
                                            { label: "Tây Bắc", value: "NORTHWEST" },
                                        ].map((item) => (
                                            <Button
                                                key={item.value}
                                                variant={direction === item.value ? "default" : "outline"}
                                                size="sm"
                                                className={`rounded-full transition-all ${direction === item.value
                                                    ? "bg-gray-600 text-white shadow-sm"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                onClick={() =>
                                                    setDirection(direction === item.value ? "" : item.value)
                                                }
                                            >
                                                {item.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Tìm thấy <span className="text-gray-600">{results.length}</span> bất động sản
                        </h2>
                        {keyword && (
                            <p className="text-sm text-gray-600 mt-1">
                                cho từ khóa "<span className="font-medium">{keyword}</span>"
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Sắp xếp:</span>
                        <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500">
                            <option>Mới nhất</option>
                            <option>Giá tăng dần</option>
                            <option>Giá giảm dần</option>
                            <option>Diện tích tăng dần</option>
                            <option>Diện tích giảm dần</option>
                        </select>
                    </div>
                </div>

                {/* Results Grid */}
                {results.length === 0 && !loading ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="text-gray-300 text-6xl mb-4">🏠</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
                        <p className="text-gray-500">Vui lòng thử lại với điều kiện tìm kiếm khác</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {results.map((property) => (
                            <div
                                key={property.id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                onClick={() => navigate(`/property/${property.id}`)}
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={property.imageUrl || "/placeholder.svg"}
                                        alt={property.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${property.saleType === "SALE"
                                            ? "bg-gray-600 text-white"
                                            : "bg-green-600 text-white"
                                            }`}>
                                            {property.saleType === "SALE" ? "Bán" : "Cho thuê"}
                                        </span>
                                    </div>
                                    {property.propertyType && (
                                        <div className="absolute top-3 right-3">
                                            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-gray-800">
                                                {property.propertyType === "APARTMENT" ? "Căn hộ" :
                                                    property.propertyType === "HOUSE" ? "Nhà ở" : "Đất"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                                        {property.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 flex items-start">
                                        <svg className="w-4 h-4 mr-1 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="line-clamp-1">{property.fullAddress}</span>
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <p className="text-lg font-bold text-gray-600">
                                            {property.price?.toLocaleString()} VNĐ
                                        </p>
                                        <div className="flex gap-3 text-sm text-gray-600">
                                            {property.propertyType !== "LAND" && (
                                                <>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                        {property.bedrooms}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {property.bathrooms}
                                                    </span>
                                                </>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                                                </svg>
                                                {property.floorAreaSqft || 0} m²
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                            <p className="text-gray-600 mt-3">Đang tải kết quả...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    );
}