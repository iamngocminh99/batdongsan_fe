import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BottomNavigation } from "./component/BottomNavigation";

const TYPE_MAP: Record<string, string> = {
    apartment: "APARTMENT",
    house: "HOUSE",
    land: "LAND",
    resort: "RESORT",
};

const TITLE_MAP: Record<string, string> = {
    apartment: "Căn hộ",
    house: "Nhà ở",
    land: "Đất nền",
    resort: "Bất động sản nghỉ dưỡng",
};

export default function PropertyListPage() {
    const { key } = useParams<{ key: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params: any = {
                    status: "PUBLISHED",
                    page: 0,
                    size: 12,
                };
                if (key && TYPE_MAP[key]) {
                    params.propertyType = TYPE_MAP[key];
                }

                const res = await axios.get("http://localhost:8080/api/properties", {
                    params,
                });

                setData(res.data?.content || []);
            } catch (err) {
                console.error(err);
                toast.error("Không thể tải danh sách bất động sản");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [key]);


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-6 max-w-7xl mx-auto w-full">
                <h1 className="text-2xl font-bold text-green-700 mb-6">
                    {TITLE_MAP[key || ""] || "Danh sách bất động sản"}
                </h1>

                {loading && (
                    <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
                )}

                {!loading && data.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                        <p className="text-gray-500 text-lg">
                            Không có bất động sản phù hợp
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((property) => (
                        <div
                            key={property.id}
                            className="border bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                            onClick={() => navigate(`/property/${property.id}`)}
                        >
                            <div className="relative">
                                <img
                                    src={property.imageUrl || "/placeholder.svg"}
                                    alt={property.title}
                                    className="w-full h-52 object-cover"
                                />
                                <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                                    {property.saleType === "SALE" ? "Bán" : "Cho thuê"}
                                </div>
                            </div>

                            <div className="p-5 space-y-2">
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                                    {property.title}
                                </h3>

                                <p className="text-gray-600 line-clamp-1">
                                    {property.fullAddress || "Đang cập nhật"}
                                </p>

                                <div className="flex justify-between items-center mt-3">
                                    <p className="text-orange-500 font-bold text-xl">
                                        {property.price?.toLocaleString("vi-VN")} VNĐ
                                    </p>

                                    <div className="flex gap-3 text-gray-600 text-sm">

                                        {property.propertyType !== "LAND" && (property.bedrooms ?? 0) > 0 && (
                                            <span>{property.bedrooms} PN</span>
                                        )}

                                        {property.propertyType !== "LAND" && (property.bathrooms ?? 0) > 0 && (
                                            <span>{property.bathrooms} WC</span>
                                        )}

                                        {Number(property.floorAreaSqft) > 0 && (
                                            <span>{property.floorAreaSqft} m²</span>
                                        )}

                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTTOM NAV */}
            <BottomNavigation />
        </div>
    );
}
