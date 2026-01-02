import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Search,
    Heart,
    MapPin,
    Star,
    Bath,
    Bed,
    Square,
    TrendingUp,
    Award,
    Shield,
    Clock,
} from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { BottomNavigation } from "./component/BottomNavigation"
import { useAuth } from "@/contexts/AuthContext"

interface PropertyImage {
    id: string
    url: string
}

interface Property {
    id: string
    title: string
    description?: string
    price: number
    bedrooms: number
    bathrooms: number
    floorAreaSqft: number
    fullAddress?: string
    imageUrl?: string
    propertyImages?: PropertyImage[]
}


export default function HomePage() {
    const [properties, setProperties] = useState<Property[]>([])
    const { user, token } = useAuth()
    const [favorites, setFavorites] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:8080/api/favorites/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then(res => {
                setFavorites(res.data.map((fav: any) => fav.property.id))
            })
        }
    }, [user])

    const toggleFavorite = async (propertyId: string) => {
        if (!user) {
            toast.error("Bạn cần đăng nhập để lưu yêu thích")
            return
        }

        const isFavorite = favorites.includes(propertyId)
        try {
            if (isFavorite) {
                await axios.delete(`http://localhost:8080/api/favorites/${user.id}/${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                toast.success("Đã bỏ yêu thích")

                setFavorites(favorites.filter(id => id !== propertyId));
                //Thông báo cho header cập nhật lại
                (window as any).favoriteBus?.emit?.();
            } else {
                await axios.post(
                    `http://localhost:8080/api/favorites/${user.id}/${propertyId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                toast.success("Đã thêm vào yêu thích")

                setFavorites([...favorites, propertyId]);
                //Thông báo cho header cập nhật lại
                (window as any).favoriteBus?.emit?.();

            }
        } catch (error) {
            toast.error("Có lỗi xảy ra")
        }
    }

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await axios.get("http://localhost:8080/api/properties", {
                params: { page: 0, size: 6 },
            })
            setProperties(res.data.content)
        } catch {
            toast.error("Không thể tải danh sách property")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const navigate = useNavigate()
    const [keyword, setKeyword] = useState("")

    const handleSearch = () => {
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
    }

    const formatPrice = (price?: number) => {
        if (!price) return "0"
        return price.toLocaleString("vi-VN")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section
                className="relative py-20 md:py-28 text-white overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://extgw.dsc.com.vn/eback/uploads/co_phieu_bat_dong_san_50cbc27782.jpg')",
                }}
            >
                {/* Overlay làm tối ảnh */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
                        Tìm ngôi nhà mơ ước của bạn
                    </h2>

                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Khám phá hàng nghìn bất động sản chất lượng cao tại Việt Nam với Bất động sản NgocMinh
                    </p>

                    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                            <Input
                                placeholder="Tìm kiếm theo địa điểm, dự án..."
                                className="pl-10 h-12 rounded-full shadow-lg bg-white/95 text-black border-0"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>

                        <Button
                            size="lg"
                            className="rounded-full px-8 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </section>


            {/* Property Types Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                            Các loại hình bất động sản phổ biến
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Hiểu rõ từng loại hình để lựa chọn đúng nhu cầu của bạn
                        </p>
                        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        <Card
                            onClick={() => navigate("/properties/house")}
                            className="cursor-pointer p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-white group"
                        >
                            <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 mb-4" />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-semibold group-hover:text-blue-600">
                                    Nhà ở
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                Nhà phố, biệt thự, liền kề. Mua để ở hoặc cho thuê dài hạn.
                            </CardContent>
                        </Card>

                        <Card
                            onClick={() => navigate("/properties/apartment")}
                            className="cursor-pointer p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-white group"
                        >
                            <div className="h-2 bg-gradient-to-r from-green-400 to-green-600 mb-4" />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-semibold group-hover:text-green-600">
                                    Căn hộ
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                Chung cư cao tầng, nhiều tiện ích, phù hợp gia đình trẻ.
                            </CardContent>
                        </Card>

                        <Card
                            onClick={() => navigate("/properties/land")}
                            className="cursor-pointer p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-white group"
                        >
                            <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4" />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-semibold group-hover:text-yellow-600">
                                    Đất nền
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                Đất chưa xây dựng, tiềm năng tăng giá cao.
                            </CardContent>
                        </Card>

                        <Card
                            onClick={() => navigate("/properties")}
                            className="cursor-pointer p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-white group border-2 border-dashed border-gray-300"
                        >
                            <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-600 mb-4" />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-semibold group-hover:text-gray-700 flex items-center gap-2">
                                    📋 Tất cả
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                Xem toàn bộ bất động sản đang được đăng bán & cho thuê
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>


            {/* Featured Properties */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12">
                        <div className="mb-4 md:mb-0 text-center md:text-left">
                            <h3 className="text-3xl font-bold text-foreground mb-2">Bất động sản mới</h3>
                            <p className="text-muted-foreground">Những dự án mới nhất hiện tại</p>
                        </div>
                        <Link to="/search">
                            <Button variant="outline" className="rounded-full px-6 py-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors">
                                Xem tất cả
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="rounded-2xl overflow-hidden shadow-lg animate-pulse">
                                    <div className="h-56 bg-gray-200"></div>
                                    <div className="p-6">
                                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="flex justify-between mb-3">
                                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                        <div className="flex space-x-4">
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <Card
                                    key={property.id}
                                    onClick={() => navigate(`/property/${property.id}`)}
                                    className="overflow-hidden group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0"
                                >
                                    <div className="relative">
                                        <img
                                            src={property.imageUrl || "/placeholder.svg"}
                                            alt={property.title}
                                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute top-3 right-3">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className={`rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-100 p-2 transition-all duration-300 ${favorites.includes(property.id) ? "text-red-500" : "text-gray-600"
                                                    }`}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // chặn sự kiện click lan ra Card
                                                    toggleFavorite(property.id);
                                                }}
                                            >
                                                <Heart
                                                    className="h-5 w-5"
                                                    fill={favorites.includes(property.id) ? "currentColor" : "none"}
                                                />

                                            </Button>
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg line-clamp-2 hover:text-purple-600 transition-colors">
                                            <Link to={`/property/${property.id}`}>{property.title}</Link>
                                        </CardTitle>
                                        <CardDescription className="flex items-center text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {property.fullAddress || "Đang cập nhật"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                                                {formatPrice(property.price)} đ
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">

                                            {(property.bedrooms ?? 0) > 0 && (
                                                <div className="flex items-center">
                                                    <Bed className="h-4 w-4 mr-1" />
                                                    {property.bedrooms} PN
                                                </div>
                                            )}

                                            {(property.bathrooms ?? 0) > 0 && (
                                                <div className="flex items-center">
                                                    <Bath className="h-4 w-4 mr-1" />
                                                    {property.bathrooms} PT
                                                </div>
                                            )}

                                            {Number(property.floorAreaSqft) > 0 && (
                                                <div className="flex items-center">
                                                    <Square className="h-4 w-4 mr-1" />
                                                    {property.floorAreaSqft} m²
                                                </div>
                                            )}

                                        </div>

                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-foreground mb-4">Báo chí & Xu hướng thị trường 2025</h3>
                        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="space-y-8">
                        <Card className="p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl md:text-3xl font-semibold text-gray-800">Tình hình thị trường hiện tại</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p className="text-lg">Giá nhà rao bán tăng nhẹ, mức độ quan tâm từ người mua được cải thiện rõ rệt, đặc biệt ở phân khúc căn hộ và nhà ở vừa túi tiền. Tuy nhiên, thị trường vẫn phân hóa mạnh giữa các vùng. <span className="font-semibold text-purple-600">Hà Nội</span> và <span className="font-semibold text-purple-600">TP.HCM</span> tiếp tục dẫn đầu về sức hút.</p>
                                <p className="text-lg">Chính phủ đang thúc đẩy đầu tư công, cải thiện hạ tầng, quy hoạch được hoàn thiện hơn, pháp lý dần minh bạch hơn giúp củng cố niềm tin người mua.</p>
                            </CardContent>
                        </Card>

                        <Card className="p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl md:text-3xl font-semibold text-gray-800">Xu hướng nổi bật & cơ hội</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <ul className="list-disc list-inside space-y-3 text-lg">
                                    <li>Phân khúc căn hộ vừa túi tiền, nhà trung cấp được đánh giá cao nhờ nhu cầu ở thực lớn.</li>
                                    <li>Bất động sản nghỉ dưỡng có thể hồi phục mạnh đặc biệt tại các khu du lịch nổi tiếng.</li>
                                    <li>Sống xanh, PropTech, đô thị vùng ven đang là xu hướng được nhiều người quan tâm.</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl md:text-3xl font-semibold text-gray-800">Lời khuyên: Có nên mua?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p className="text-lg">Nếu bạn định mua để ở lâu dài, chọn dự án pháp lý rõ, vị trí có hạ tầng tốt, thì đây là cơ hội tốt.</p>
                                <p className="text-lg">Nếu bạn muốn lướt sóng hoặc đầu tư ngắn hạn, hãy thận trọng với các phân khúc đã tăng giá mạnh hoặc chưa rõ giấy tờ, có thể chịu ảnh hưởng rủi ro lớn hơn.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-foreground mb-4">
                            Tại sao chọn chúng tôi để mua bán?
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Chúng tôi cam kết mang đến trải nghiệm tìm kiếm bất động sản tốt nhất
                        </p>
                        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg">
                                <Shield className="h-8 w-8" />
                            </div>
                            <h4 className="font-semibold mb-2 text-lg text-gray-800">Uy tín đảm bảo</h4>
                            <p className="text-sm text-muted-foreground">
                                Tất cả thông tin được xác minh và đảm bảo chính xác
                            </p>
                        </Card>

                        <Card className="text-center p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg">
                                <Award className="h-8 w-8" />
                            </div>
                            <h4 className="font-semibold mb-2 text-lg text-gray-800">Chất lượng cao</h4>
                            <p className="text-sm text-muted-foreground">
                                Chỉ những bất động sản chất lượng cao được chọn lọc
                            </p>
                        </Card>

                        <Card className="text-center p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                                <Clock className="h-8 w-8" />
                            </div>
                            <h4 className="font-semibold mb-2 text-lg text-gray-800">Hỗ trợ 24/7</h4>
                            <p className="text-sm text-muted-foreground">
                                Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ
                            </p>
                        </Card>

                        <Card className="text-center p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg">
                                <TrendingUp className="h-8 w-8" />
                            </div>
                            <h4 className="font-semibold mb-2 text-lg text-gray-800">Cập nhật liên tục</h4>
                            <p className="text-sm text-muted-foreground">
                                Thông tin thị trường và giá cả được cập nhật thường xuyên
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Bottom Navigation */}
            <div className="flex flex-col items-center p-2 text-muted-foreground hover:text-orange-500">
                <BottomNavigation />
            </div>
        </div>
    )
}